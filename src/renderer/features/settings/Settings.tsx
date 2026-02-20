import React from "react";
import { useTranslation } from "react-i18next";

import { useLauncherContext } from "../../context/LauncherContext";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setLanguage } = useLauncherContext();
  return (
    <div className="settings-page flex-1 flex flex-col justify-between">
      <div>
        <div className="card mb-4">
          <h2 className="text-xl font-bold mb-4">{t("settings.language")}</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded ${
                i18n.language === "ko"
                  ? "bg-yellow-500 text-black font-bold"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => {
                i18n.changeLanguage("ko");
                setLanguage("ko");
              }}
            >
              {i18n.getFixedT("ko")("app.lang")}
            </button>
            <button
              className={`px-4 py-2 rounded ${
                i18n.language === "en"
                  ? "bg-yellow-500 text-black font-bold"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => {
                i18n.changeLanguage("en");
                setLanguage("en");
              }}
            >
              {i18n.getFixedT("en")("app.lang")}
            </button>
          </div>
        </div>

        <div className="card">
          <p>
            Version: v{__APP_VERSION__} ({__APP_HASH__})
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
