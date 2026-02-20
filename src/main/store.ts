import path from "node:path";

import { app } from "electron";
import Store from "electron-store";

import { AppConfig, DEFAULT_CONFIG } from "../shared/types";

// Force User Data path to match electron-builder 'productName' (with spaces)
// This must be set BEFORE creating the Store instance to ensure config.json maps to correct folder.
app.setPath(
  "userData",
  path.join(
    app.getPath("appData"),
    "Arknights Endfield Optimization Tool for Chen",
  ),
);

const store = new Store<AppConfig>({
  defaults: DEFAULT_CONFIG,
});

/**
 * Get a value from the store
 */
export function getConfig(key?: string) {
  return key ? store.get(key as keyof AppConfig) : store.store;
}

/**
 * Set a value in the store
 */
export function setConfig(key: string, value: unknown) {
  store.set(key as keyof AppConfig, value as AppConfig[keyof AppConfig]);
}

/**
 * Delete a key from the store
 */
export function deleteConfig(key: string) {
  store.delete(key as keyof AppConfig);
}

export default store;
