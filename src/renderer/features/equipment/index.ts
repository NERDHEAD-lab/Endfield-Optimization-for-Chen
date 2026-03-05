import { IFeatureModule } from "../feature.types";
import { EquipmentView } from "./EquipmentView";
// 추후 사용할 적절한 아이콘 경로로 수정 (임시 텍스트 아이콘 또는 공란)

export const EquipmentFeature: IFeatureModule = {
  menu: {
    id: "equipment",
    label: "nav.equipment", // i18n에 추가 필요
    description: "equipment.description", // i18n에 추가 필요
    icon: "build", // 사이드바에서 material icon 혹은 url 로 렌더링되게 설계된 경우 문자열 사용
    usingKeys: ["equipment_settings"],
    section: "body",
    priority: 15,
    component: EquipmentView,
  },
};
