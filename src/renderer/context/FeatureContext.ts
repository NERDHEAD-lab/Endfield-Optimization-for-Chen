import { createContext, useContext } from "react";

import { IMenuFeature } from "../features/feature.types";

export interface FeatureStorage {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
}

export interface FeatureContextValue {
  activeFeature: IMenuFeature | null;
  storage: FeatureStorage;
}

export const FeatureContext = createContext<FeatureContextValue | null>(null);

export const useFeatureContext = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error(
      "useFeatureContext must be used within a FeatureContextProvider",
    );
  }
  return context;
};
