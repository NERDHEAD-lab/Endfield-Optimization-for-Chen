export interface AppConfig {
  theme: "light" | "dark" | "system";
  language: "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

  // Feature: Battery Optimization
  batteryTarget: number; // Target Power

  // Feature: AFK Overlay
  afkOverlayOpacity: number; // 0.0 - 1.0
  afkInputLock: boolean;

  // UI/Launcher Persistence
  favorites: string[];
  customOrder: string[];
  featureData: Record<string, Record<string, unknown>>;

  // System
  launcherVersion: string;
  autoUpdate: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
  theme: "system",
  language: "ko",
  batteryTarget: 2775,
  afkOverlayOpacity: 1.0,
  afkInputLock: true,
  favorites: [],
  customOrder: [],
  featureData: {},
  launcherVersion: "0.0.0",
  autoUpdate: true,
};

export type UpdateState =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "downloaded"
  | "error";

export interface UpdateStatus {
  state: UpdateState;
  progress?: number;
  version?: string;
  error?: string;
}

export interface ChangelogItem {
  version: string;
  date: string;
  body: string;
  html_url: string;
}

export type ReleaseNote = ChangelogItem;
