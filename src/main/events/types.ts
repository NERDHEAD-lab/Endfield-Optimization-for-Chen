import { BrowserWindow } from "electron";

export enum EventType {
  // Config
  CONFIG_CHANGED = "CONFIG_CHANGED",

  // Update
  UI_UPDATE_CHECK = "UI_UPDATE_CHECK", // Request from UI
  UI_UPDATE_DOWNLOAD = "UI_UPDATE_DOWNLOAD", // Request from UI
  UI_UPDATE_INSTALL = "UI_UPDATE_INSTALL", // Request from UI

  // Patch Notes
  UI_PATCH_NOTES_REQUEST = "UI_PATCH_NOTES_REQUEST", // Request from UI to get notes

  // App Control
  APP_QUIT = "APP_QUIT",
  APP_MINIMIZE = "APP_MINIMIZE",
}

export type EventHandler<T = unknown> = (
  payload: T,
  context: AppContext,
) => void | Promise<void>;

export interface AppEvent<T = unknown> {
  type: EventType;
  payload: T;
  timestamp: number;
}

// Optimization for Chen doesn't have a full AppContext definition in this file yet,
// so we define a placeholder or import it if it exists.
// Based on previous analysis, MainWindow is needed.
export interface AppContext {
  mainWindow: BrowserWindow | null;
}
