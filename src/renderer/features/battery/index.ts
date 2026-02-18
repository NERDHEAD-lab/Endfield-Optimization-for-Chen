import { IFeatureModule } from "../feature.types";
import BatteryCalculator from "./BatteryCalculator";

export const BatteryFeature: IFeatureModule = {
  menu: {
    id: "battery",
    label: "nav.battery",
    section: "body",
    priority: 10,
    component: BatteryCalculator,
  },
};
