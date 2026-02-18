import { IFeatureModule } from "../feature.types";
import Settings from "./Settings";

export const SettingsFeature: IFeatureModule = {
  menu: {
    id: "settings",
    label: "nav.info",
    description: "settings.description",
    section: "footer",
    priority: 999,
    component: Settings,
  },
};
