import { BrowserWindow } from "electron";

import { ChangelogItem } from "../../shared/types";

export enum EventType {
  // Config
  CONFIG_CHANGE = "CONFIG_CHANGE",
  CONFIG_DELETE = "CONFIG_DELETE",

  // Update
  UI_UPDATE_CHECK = "UI_UPDATE_CHECK",
  UI_UPDATE_DOWNLOAD = "UI_UPDATE_DOWNLOAD",
  UI_UPDATE_INSTALL = "UI_UPDATE_INSTALL",

  // Patch Notes
  UI_PATCH_NOTES_REQUEST = "UI_PATCH_NOTES_REQUEST",
  SHOW_CHANGELOG = "SHOW_CHANGELOG",

  // App Control
  APP_QUIT = "APP_QUIT",
  APP_MINIMIZE = "APP_MINIMIZE",

  // Lifecycle
  UI_READY = "UI_READY",
}

export interface ConfigChangeEvent {
  key: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ConfigDeleteEvent {
  key: string;
  oldValue: unknown;
}

export interface ShowChangelogEvent {
  changelogs: ChangelogItem[];
  oldVersion: string;
  newVersion: string;
}

export type UIUpdateCheckEvent = Record<string, never>;

// Generic Event Payload Map
export interface EventPayloadMap {
  [EventType.CONFIG_CHANGE]: ConfigChangeEvent;
  [EventType.CONFIG_DELETE]: ConfigDeleteEvent;
  [EventType.SHOW_CHANGELOG]: ShowChangelogEvent;
  [EventType.UI_UPDATE_CHECK]: UIUpdateCheckEvent;
  // ... other events can be added as needed
  [key: string]: unknown;
}

export interface AppContext {
  mainWindow: BrowserWindow | null;
}

export interface AppEvent<T = unknown> {
  type: EventType;
  payload: T;
  timestamp: number;
}

// For legacy function-based handlers
export type EventCallback<T = unknown> = (
  payload: T,
  context: AppContext,
) => void | Promise<void>;

export interface EventHandler<T = unknown> {
  id: string;
  targetEvent: EventType;
  condition?: (event: AppEvent<T>) => boolean;
  handle: (event: AppEvent<T>, context: AppContext) => void | Promise<void>;
}
