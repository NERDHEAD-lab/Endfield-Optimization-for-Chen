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
      "sidebar.patchnotes": "패치 노트",
      "update.title": "업데이트",
      "update.status.checking": "업데이트 확인 중...",
      "update.status.available": "새 버전 사용 가능: {{version}}",
      "update.status.downloading": "다운로드 중... {{progress}}%",
      "update.status.downloaded": "다운로드 완료. 설치 후 재시작하세요.",
      "update.status.idle": "최신 버전입니다.",
      "update.button.update": "업데이트",
      "update.button.install": "설치 및 재시작",
      "update.button.close": "닫기",
      "patchnotes.title": "패치 노트",
      "patchnotes.loading": "패치 노트 불러오는 중...",
      "patchnotes.view_github": "GitHub에서 보기",
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
      "sidebar.patchnotes": "Patch Notes",
      "update.title": "Update",
      "update.status.checking": "Checking for updates...",
      "update.status.available": "New version available: {{version}}",
      "update.status.downloading": "Downloading... {{progress}}%",
      "update.status.downloaded": "Downloaded. Restart to install.",
      "update.status.idle": "Up to date.",
      "update.button.update": "Update",
      "update.button.install": "Install & Restart",
      "update.button.close": "Close",
      "patchnotes.title": "Patch Notes",
      "patchnotes.loading": "Loading release notes...",
      "patchnotes.view_github": "View on GitHub",
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
