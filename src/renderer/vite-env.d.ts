/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __APP_HASH__: string;

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
    on: (channel: string, func: (...args: unknown[]) => void) => void;
    off: (channel: string, func: (...args: unknown[]) => void) => void;
  };
}

/* eslint-disable no-var */
declare var electronAPI: Window["electronAPI"];
