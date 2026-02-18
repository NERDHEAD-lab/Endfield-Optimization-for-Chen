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
      /* eslint-disable-next-line no-restricted-syntax */
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
      /* eslint-disable-next-line no-restricted-syntax */
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
    /* eslint-disable-next-line no-restricted-syntax */
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [favorites, customOrder]);

  // --- Actions ---
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  const contextValue = useMemo<LauncherContextValue>(
    () => ({
      favorites,
      customOrder,
      toggleFavorite,
      setCustomOrder,
    }),
    [favorites, customOrder],
  );

  return (
    <LauncherContext.Provider value={contextValue}>
      {children}
    </LauncherContext.Provider>
  );
};
