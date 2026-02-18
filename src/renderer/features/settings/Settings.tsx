import React from "react";
import { useTranslation } from "react-i18next";
import { IFeatureModule } from "../feature.types";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-8">
      <h1>{t("nav.settings")}</h1>
      <div className="card">
        <p>Version: v{__APP_VERSION__}</p>
        <p>Commit: {__APP_HASH__}</p>
        <p>Developer: NERDHEAD LAB</p>
      </div>
    </div>
  );
};

export const SettingsFeature: IFeatureModule = {
  menu: {
    id: "settings",
    label: "nav.settings",
    section: "footer",
    priority: 999,
    component: Settings,
  },
};

export default Settings;
