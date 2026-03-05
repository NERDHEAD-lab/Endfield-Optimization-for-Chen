import { useLauncherContext } from "../context";

/**
 * Hook to access feature-specific storage.
 * Only keys defined in the feature's `usingKeys` are accessible.
 */
export const useFeatureStorage = () => {
  const { storage } = useLauncherContext();
  return storage;
};
