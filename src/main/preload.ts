import { contextBridge, ipcRenderer } from "electron";

import type { ChangelogItem } from "../shared/types";

contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  closeWindow: () => ipcRenderer.send("window-close"),
  getConfig: (key: string) => ipcRenderer.invoke("config:get", key),
  setConfig: (key: string, value: unknown) =>
    ipcRenderer.invoke("config:set", key, value),

  checkForUpdates: () => ipcRenderer.send("update-check"),
  onUpdateAvailable: (callback: (version: string) => void) =>
    ipcRenderer.on("update-available", (_event, version) => callback(version)),

  send: (channel: string, payload?: unknown) => {
    // Whitelist channels for security
    const validChannels = [
      "app-version",
      "UI_READY",
      "UI_UPDATE_CHECK",
      "UI_UPDATE_DOWNLOAD",
      "UI_UPDATE_INSTALL",
      "UI_PATCH_NOTES_REQUEST",
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, payload);
    } else {
      console.warn(`Blocked unauthorized IPC send on channel: ${channel}`);
    }
  },
  on: (channel: string, func: (...args: unknown[]) => void) => {
    const validChannels = [
      "update-status-change",
      "update-error",
      "patch-notes-data",
      "patch-notes-error",
    ];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
  off: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, (_event, ...args) => func(...args));
  },

  // Explicit type safety for config changes
  onConfigChange: (
    callback: (key: string, value: unknown, oldValue: unknown) => void,
  ) => {
    const subscription = (
      _event: Electron.IpcRendererEvent,
      key: string,
      value: unknown,
      oldValue: unknown,
    ) => callback(key, value, oldValue);
    ipcRenderer.on("config-changed", subscription);
    return () => {
      ipcRenderer.removeListener("config-changed", subscription);
    };
  },

  onShowChangelog: (
    callback: (data: {
      changelogs: ChangelogItem[];
      oldVersion: string;
      newVersion: string;
    }) => void,
  ) => {
    const subscription = (
      _event: Electron.IpcRendererEvent,
      data: {
        changelogs: ChangelogItem[];
        oldVersion: string;
        newVersion: string;
      },
    ) => callback(data);
    ipcRenderer.on("UI:SHOW_CHANGELOG", subscription);
    return () => {
      ipcRenderer.removeListener("UI:SHOW_CHANGELOG", subscription);
    };
  },
});
