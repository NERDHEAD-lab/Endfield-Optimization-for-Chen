import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ko: {
    translation: {
      "app.title": "천우도 할 수 있는 명일방주: 엔드필드 최적화!",
      "nav.home": "홈",
      "nav.battery": "배터리 최적화",
      "nav.settings": "설정",
      "nav.info": "정보",
      "home.welcome":
        "Chen을 위한 엔드필드 최적화 도구에 오신 것을 환영합니다.",
      "home.description": "엔드필드 최적화 도구 메인 대시보드",
      "battery.title": "배터리 최적화",
      "battery.target": "시설 총 전력량",
      "battery.type_select": "배터리 종류",
      "battery.description": "기지 최적화를 위한 배터리 효율 계산기",
      "battery.type.lc_wuling": "저용량 무릉 배터리",
      "battery.type.hc_valley": "대용량 협곡 배터리",
      "battery.type.mc_valley": "중용량 협곡 배터리",
      "battery.type.lc_valley": "저용량 협곡 배터리",
      "battery.type.originium": "오리지늄",
      "settings.description": "시스템 정보 및 크레딧",
    },
  },
  en: {
    translation: {
      "app.title": "Arknights: Endfield Optimization Tool for Chen",
      "nav.home": "Home",
      "nav.battery": "Battery Opt",
      "nav.settings": "Settings",
      "nav.info": "Info",
      "home.welcome": "Welcome to Endfield Optimization for Chen.",
      "home.description": "Endfield Optimization Tool Main Dashboard",
      "battery.title": "Battery Optimization",
      "battery.target": "Total Power Requirement",
      "battery.type_select": "Battery Type",
      "battery.description": "Calculate optimal battery usage for your base.",
      "battery.type.lc_wuling": "LC Wuling Battery",
      "battery.type.hc_valley": "HC Valley Battery",
      "battery.type.mc_valley": "MC Valley Battery",
      "battery.type.lc_valley": "LC Valley Battery",
      "battery.type.originium": "Originium",
      "settings.description": "System Information and Credits",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ko", // Default
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
