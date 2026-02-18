import { IFeatureModule } from "../feature.types";
import BatteryCalculator from "./BatteryCalculator";
import icon from "../../assets/LC Wuling Battery.webp";

export const BatteryFeature: IFeatureModule = {
  menu: {
    id: "battery",
    label: "nav.battery",
    description: "battery.description",
    icon: icon,
    section: "body",
    priority: 10,
    component: BatteryCalculator,
  },
};
