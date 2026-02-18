import { HomeFeature } from "./home";
import { SettingsFeature } from "./settings";
import { BatteryFeature } from "./battery";
import { IMenuFeature } from "./feature.types";

export const features = [HomeFeature, SettingsFeature, BatteryFeature];

// Helper to get sorted menu items
export const getMenuItems = (): IMenuFeature[] => {
  return features
    .flatMap((f) => (Array.isArray(f.menu) ? f.menu : [f.menu]))
    .sort((a, b) => a.priority - b.priority);
};
