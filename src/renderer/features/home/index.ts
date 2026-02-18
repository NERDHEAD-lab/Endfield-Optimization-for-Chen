import { IFeatureModule } from "../feature.types";
import Home from "./Home";

export const HomeFeature: IFeatureModule = {
  menu: {
    id: "home",
    label: "nav.home",
    description: "home.description",
    icon: "home",
    section: "header",
    priority: 0,
    component: Home,
  },
};
