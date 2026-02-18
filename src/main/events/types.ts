export enum EventType {
  // Config
  CONFIG_CHANGED = "CONFIG_CHANGED",

  // Update
  UPDATE_CHECK = "UPDATE_CHECK",
  UPDATE_AVAILABLE = "UPDATE_AVAILABLE",
  UPDATE_DOWNLOADED = "UPDATE_DOWNLOADED",

  // App Control
  APP_QUIT = "APP_QUIT",
  APP_MINIMIZE = "APP_MINIMIZE",
}

export type EventHandler<T = unknown> = (payload: T) => void | Promise<void>;

export interface AppEvent<T = unknown> {
  type: EventType;
  payload: T;
  timestamp: number;
}
