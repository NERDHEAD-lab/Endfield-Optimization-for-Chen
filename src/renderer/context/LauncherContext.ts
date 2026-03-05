import { createContext, useContext } from "react";

import { IMenuFeature } from "../features/feature.types";

export interface FeatureStorage {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
}

export interface LauncherContextValue {
  favorites: string[];
  customOrder: string[];
  toggleFavorite: (id: string) => void;
  setCustomOrder: (order: string[]) => void;
  /** Checks if the app version has changed since last run. Returns true if updated. */
  checkVersionUpdate: () => Promise<boolean>;
  setLanguage: (lang: string) => void;

  // --- Feature Context Unified ---
  activeFeature: IMenuFeature | null;
  setActiveFeature: (feature: IMenuFeature | null) => void;
  storage: FeatureStorage;
}

export const LauncherContext = createContext<LauncherContextValue | null>(null);

export const useLauncherContext = () => {
  const context = useContext(LauncherContext);
  if (!context) {
    throw new Error(
      "useLauncherContext must be used within a LauncherContextProvider",
    );
  }
  return context;
};
