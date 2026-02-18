import { createContext, useContext } from "react";

export interface LauncherContextValue {
  favorites: string[];
  customOrder: string[];
  toggleFavorite: (id: string) => void;
  setCustomOrder: (order: string[]) => void;
  /** Checks if the app version has changed since last run. Returns true if updated. */
  checkVersionUpdate: () => boolean;
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
