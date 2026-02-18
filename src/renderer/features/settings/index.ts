import { IFeatureModule } from "../feature.types";
import Settings from "./Settings";

export const SettingsFeature: IFeatureModule = {
  menu: {
    id: "settings",
    label: "Info", // Changed from Settings
    section: "footer",
    priority: 999,
    component: Settings,
  },
};
