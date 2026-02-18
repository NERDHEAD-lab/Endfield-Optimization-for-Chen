import { createContext, useContext } from "react";

export interface LauncherContextValue {
  favorites: string[];
  customOrder: string[];
  toggleFavorite: (id: string) => void;
  setCustomOrder: (order: string[]) => void;
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
