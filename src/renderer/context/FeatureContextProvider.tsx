import React, { useMemo } from "react";

import { FeatureContext, FeatureStorage } from "./FeatureContext";
import { IMenuFeature } from "../features/feature.types";

export const FeatureContextProvider: React.FC<{
  activeFeature: IMenuFeature | null;
  children: React.ReactNode;
}> = ({ activeFeature, children }) => {
  const storage = useMemo<FeatureStorage>(() => {
    const allowedKeys = activeFeature?.usingKeys || [];

    const validateKey = (key: string) => {
      if (!allowedKeys.includes(key)) {
        console.warn(
          `[FeatureStorage] Access denied for key "${key}" in feature "${activeFeature?.id}". ` +
            `Please add it to usingKeys in feature definition.`,
        );
        return false;
      }
      return true;
    };

    return {
      get: <T,>(key: string): T | null => {
        if (!validateKey(key)) return null;
        /* eslint-disable-next-line no-restricted-syntax */
        const data = localStorage.getItem(key);
        if (!data) return null;
        try {
          return JSON.parse(data) as T;
        } catch {
          return data as unknown as T;
        }
      },
      set: <T,>(key: string, value: T): void => {
        if (!validateKey(key)) return;
        const data = typeof value === "string" ? value : JSON.stringify(value);
        /* eslint-disable-next-line no-restricted-syntax */
        localStorage.setItem(key, data);
      },
      remove: (key: string): void => {
        if (!validateKey(key)) return;
        /* eslint-disable-next-line no-restricted-syntax */
        localStorage.removeItem(key);
      },
    };
  }, [activeFeature]);

  const contextValue = useMemo(
    () => ({ activeFeature, storage }),
    [activeFeature, storage],
  );

  return (
    <FeatureContext.Provider value={contextValue}>
      {children}
    </FeatureContext.Provider>
  );
};
