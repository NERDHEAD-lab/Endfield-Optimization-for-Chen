import React from "react";
import { useTranslation } from "react-i18next";
import { IFeatureModule } from "../feature.types";

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-8">
      <h1>{t("nav.home")}</h1>
      <p>{t("home.welcome")}</p>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Quick Tools</h3>
          <ul>
            <li>{t("nav.battery")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const HomeFeature: IFeatureModule = {
  menu: {
    id: "home",
    label: "nav.home",
    section: "header",
    priority: 0,
    component: Home,
  },
};

export default Home;
