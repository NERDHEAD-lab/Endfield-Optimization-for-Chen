import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ko: {
    translation: {
      "nav.home": "홈",
      "nav.battery": "배터리 최적화",
      "nav.settings": "설정",
      "home.welcome":
        "Chen을 위한 엔드필드 최적화 도구에 오신 것을 환영합니다.",
      "battery.title": "무릉 배터리 효율 계산기",
      "battery.target": "시설 총 전력량",
    },
  },
  en: {
    translation: {
      "nav.home": "Home",
      "nav.battery": "Battery Opt",
      "nav.settings": "Settings",
      "home.welcome": "Welcome to Endfield Optimization for Chen.",
      "battery.title": "Mulung Battery Calculator",
      "battery.target": "Total Power Requirement",
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
