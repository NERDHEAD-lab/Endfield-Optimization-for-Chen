/// <reference types="vite/client" />

declare module "*.ico" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

interface Window {
  electronAPI: {
    minimizeWindow: () => void;
    closeWindow: () => void;
    getConfig: (key: string) => Promise<unknown>;
    setConfig: (key: string, value: unknown) => Promise<void>;
    checkForUpdates: () => void;
    onUpdateAvailable: (callback: (version: string) => void) => void;
    send: (channel: string, payload?: unknown) => void;
    on: (channel: string, func: (...args: unknown[]) => void) => void;
    off: (channel: string, func: (...args: unknown[]) => void) => void;
    onConfigChange: (
      callback: (key: string, value: unknown, oldValue: unknown) => void,
    ) => () => void;

    onShowChangelog: (
      callback: (data: {
        changelogs: unknown[];
        oldVersion: string;
        newVersion: string;
      }) => void,
    ) => () => void;
  };
}

declare var electronAPI: Window["electronAPI"];
