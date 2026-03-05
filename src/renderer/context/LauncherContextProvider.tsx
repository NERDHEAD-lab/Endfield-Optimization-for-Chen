import React, { useState, useEffect, useMemo, useCallback } from "react";

import { LauncherContext, LauncherContextValue } from "./LauncherContext";
import { IMenuFeature } from "../features/feature.types";

export const LauncherContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeFeature, setActiveFeature] = useState<IMenuFeature | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customOrder, setCustomOrder] = useState<string[]>([]);
  const [featureData, setFeatureData] = useState<
    Record<string, Record<string, unknown>>
  >({});

  // --- Initialization (Load from config.json) ---
  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        const order = await globalThis.electronAPI.getConfig("customOrder");
        const favs = await globalThis.electronAPI.getConfig("favorites");
        const data = await globalThis.electronAPI.getConfig("featureData");

        if (Array.isArray(order)) setCustomOrder(order);
        if (Array.isArray(favs)) setFavorites(favs);
        if (data && typeof data === "object") {
          setFeatureData(data as Record<string, Record<string, unknown>>);
        }
      } catch (e) {
        console.error("[LauncherContext] Failed to load initial config", e);
      }
    };

    loadInitialConfig();

    // Listen for external config changes (e.g., from other windows)
    const unsubscribe = globalThis.electronAPI.onConfigChange((key, value) => {
      if (key === "favorites" && Array.isArray(value)) setFavorites(value);
      if (key === "customOrder" && Array.isArray(value)) setCustomOrder(value);
      if (key === "featureData" && value && typeof value === "object") {
        setFeatureData(value as Record<string, Record<string, unknown>>);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Actions ---
  const toggleFavorite = useCallback(
    (id: string) => {
      const nextFavs = favorites.includes(id)
        ? favorites.filter((fid) => fid !== id)
        : [...favorites, id];

      setFavorites(nextFavs);
      globalThis.electronAPI.setConfig("favorites", nextFavs);
    },
    [favorites],
  );

  const handleSetCustomOrder = (order: string[]) => {
    setCustomOrder(order);
    globalThis.electronAPI.setConfig("customOrder", order);
  };

  const checkVersionUpdate = async () => {
    try {
      const lastRunVersion =
        await globalThis.electronAPI.getConfig("launcherVersion");
      const currentVersion = __APP_VERSION__;

      if (lastRunVersion !== currentVersion) {
        await globalThis.electronAPI.setConfig(
          "launcherVersion",
          currentVersion,
        );
        return true;
      }
    } catch (e) {
      console.error("[LauncherContext] Failed to check version", e);
    }
    return false;
  };

  const setLanguage = (lang: string) => {
    globalThis.electronAPI.setConfig("language", lang);
  };

  // --- Scoped Storage Logic ---
  const storage = useMemo(() => {
    const featureId = activeFeature?.id || "global";
    const allowedKeys = activeFeature?.usingKeys || [];

    const validateKey = (key: string) => {
      if (!activeFeature) return false;
      if (!allowedKeys.includes(key)) {
        console.warn(
          `[FeatureStorage] Access denied for key "${key}" in feature "${featureId}". ` +
            `Please add it to usingKeys in feature definition.`,
        );
        return false;
      }
      return true;
    };

    return {
      get: <T,>(key: string): T | null => {
        if (!validateKey(key)) return null;
        const featureSubset = featureData[featureId];
        return (featureSubset?.[key] as T) ?? null;
      },
      set: <T,>(key: string, value: T): void => {
        if (!validateKey(key)) return;

        const newData = {
          ...featureData,
          [featureId]: {
            ...(featureData[featureId] || {}),
            [key]: value,
          },
        };
        setFeatureData(newData);
        globalThis.electronAPI.setConfig("featureData", newData);
      },
      remove: (key: string): void => {
        if (!validateKey(key)) return;

        const updatedFeatureSubset = { ...(featureData[featureId] || {}) };
        delete updatedFeatureSubset[key];

        const newData = {
          ...featureData,
          [featureId]: updatedFeatureSubset,
        };
        setFeatureData(newData);
        globalThis.electronAPI.setConfig("featureData", newData);
      },
    };
  }, [activeFeature, featureData]);

  const contextValue = useMemo<LauncherContextValue>(
    () => ({
      favorites,
      customOrder,
      toggleFavorite,
      setCustomOrder: handleSetCustomOrder,
      checkVersionUpdate,
      setLanguage,
      activeFeature,
      setActiveFeature,
      storage,
    }),
    [favorites, customOrder, toggleFavorite, activeFeature, storage],
  );

  return (
    <LauncherContext.Provider value={contextValue}>
      {children}
    </LauncherContext.Provider>
  );
};
