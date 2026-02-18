export interface AppConfig {
  theme: "light" | "dark" | "system";
  language: "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

  // Feature: Battery Optimization
  batteryTarget: number; // Target Power

  // Feature: AFK Overlay
  afkOverlayOpacity: number; // 0.0 - 1.0
  afkInputLock: boolean;

  // System
  launcherVersion: string;
  autoUpdate: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
  theme: "system",
  language: "ko",
  batteryTarget: 1000,
  afkOverlayOpacity: 1.0,
  afkInputLock: true,
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

export interface ReleaseNote {
  version: string;
  date: string;
  body: string;
  html_url: string;
}
