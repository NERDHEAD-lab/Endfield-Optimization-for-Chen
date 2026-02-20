import React, { useState, useEffect, useMemo } from "react";

import { LauncherContext, LauncherContextValue } from "./LauncherContext";

interface SavedMenuState {
  order: string[];
  favorites: string[];
}

const STORAGE_KEY = "endfield_menu_state_v1";

export const LauncherContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // --- State Initialization (Lazy Load) ---
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedMenuState = JSON.parse(saved);
        return parsed.favorites || [];
      }
    } catch (e) {
      console.error("[LauncherContext] Failed to load favorites", e);
    }
    return [];
  });

  const [customOrder, setCustomOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedMenuState = JSON.parse(saved);
        return parsed.order || [];
      }
    } catch (e) {
      console.error("[LauncherContext] Failed to load order", e);
    }
    return [];
  });

  // --- Persistence ---
  useEffect(() => {
    const state: SavedMenuState = {
      order: customOrder,
      favorites,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [favorites, customOrder]);

  // --- Actions ---
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  const checkVersionUpdate = () => {
    try {
      const lastRunVersion = localStorage.getItem("last_run_version");
      const currentVersion = __APP_VERSION__;

      if (lastRunVersion !== currentVersion) {
        localStorage.setItem("last_run_version", currentVersion);
        return true;
      }
    } catch (e) {
      console.error("[LauncherContext] Failed to check version", e);
    }
    return false;
  };

  const setLanguage = (lang: string) => {
    localStorage.setItem("language", lang);
    globalThis.electronAPI.setConfig("language", lang);
  };

  const contextValue = useMemo<LauncherContextValue>(
    () => ({
      favorites,
      customOrder,
      toggleFavorite,
      setCustomOrder,
      checkVersionUpdate,
      setLanguage,
    }),
    [favorites, customOrder],
  );

  return (
    <LauncherContext.Provider value={contextValue}>
      {children}
    </LauncherContext.Provider>
  );
};
