import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./App.css";
import icon from "./assets/icon.ico";

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="p-8">
      <h1>{t("nav.home")}</h1>
      <p>{t("home.welcome")}</p>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Quick Tools</h3>
          <ul>
            <li>Coming Soon...</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Settings = () => (
  <div className="p-8">
    <h1>Settings</h1>
    <div className="card">
      <p>Version: v{__APP_VERSION__}</p>
      <p>Commit: {__APP_HASH__}</p>
      <p>Developer: NERDHEAD LAB</p>
    </div>
  </div>
);

type Tab = "home" | "settings";

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <div className="title-bar-drag-region">
        <img src={icon} alt="App Icon" className="title-bar-icon" />
        <span className="title-bar-text">Endfield Optimization for Chen</span>
      </div>
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Endfield Tool</h2>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeTab === "home" ? "active" : ""}
            onClick={() => setActiveTab("home")}
          >
            {t("nav.home")}
          </li>
          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            {t("nav.settings")}
          </li>
        </ul>
      </nav>
      <main className="content">{renderContent()}</main>
    </div>
  );
}

export default App;
