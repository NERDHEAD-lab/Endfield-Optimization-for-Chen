import { IFeatureModule } from "../feature.types";
import Home from "./Home";

export const HomeFeature: IFeatureModule = {
  menu: {
    id: "home",
    label: "nav.home",
    description: "home.description",
    section: "header",
    priority: 0,
    component: Home,
  },
};
