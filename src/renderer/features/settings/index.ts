import { IFeatureModule } from "../feature.types";
import Settings from "./Settings";

export const SettingsFeature: IFeatureModule = {
  menu: {
    id: "settings",
    label: "nav.info",
    description: "settings.description",
    icon: "info",
    usingKeys: ["app_settings"],
    section: "footer",
    priority: 1000,
    component: Settings,
  },
};
