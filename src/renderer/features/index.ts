import { HomeFeature } from "./home/Home";
import { SettingsFeature } from "./settings/Settings";
import { BatteryFeature } from "./battery/BatteryCalculator";
import { IMenuFeature } from "./feature.types";

export const features = [HomeFeature, SettingsFeature, BatteryFeature];

// Helper to get sorted menu items
export const getMenuItems = (): IMenuFeature[] => {
  return features.map((f) => f.menu).sort((a, b) => a.priority - b.priority);
};
