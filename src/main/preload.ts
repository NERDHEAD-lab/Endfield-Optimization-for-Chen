import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  closeWindow: () => ipcRenderer.send("window-close"),

  // Config
  getConfig: (key: string) => ipcRenderer.invoke("config:get", key),
  setConfig: (key: string, value: unknown) =>
    ipcRenderer.invoke("config:set", key, value),

  // Update
  checkForUpdates: () =>
    ipcRenderer.send("UI_UPDATE_CHECK", { isSilent: false }),
  onUpdateAvailable: (callback: (version: string) => void) => {
    ipcRenderer.on("update-available", (_, version) => callback(version));
  },

  // Events
  send: (channel: string, payload?: unknown) => {
    ipcRenderer.send(channel, payload);
  },
  on: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args));
  },
  off: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, (_, ...args) => func(...args));
  },
});
