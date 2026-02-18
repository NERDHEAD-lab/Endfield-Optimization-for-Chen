import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  closeWindow: () => ipcRenderer.send("window-close"),

  // Config
  getConfig: (key: string) => ipcRenderer.invoke("config:get", key),
  setConfig: (key: string, value: unknown) =>
    ipcRenderer.invoke("config:set", key, value),

  // Update
  checkForUpdates: () => ipcRenderer.send("update:check"),
  onUpdateAvailable: (callback: (version: string) => void) => {
    ipcRenderer.on("update-available", (_, version) => callback(version));
  },

  // Events
  on: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args));
  },
  off: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, (_, ...args) => func(...args));
  },
});
