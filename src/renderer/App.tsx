import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getMenuItems } from "./features";
import icon from "./assets/icon.ico";
import { Sidebar } from "./components/Sidebar";
import "./App.css";

function App() {
  const { t } = useTranslation();
  const menuItems = useMemo(() => getMenuItems(), []);
  const [activeTabId, setActiveTabId] = useState<string>(
    menuItems[0]?.id || "home",
  );

  const activeItem = useMemo(
    () => menuItems.find((item) => item.id === activeTabId),
    [activeTabId, menuItems],
  );

  const ActiveComponent = useMemo(() => {
    return activeItem ? activeItem.component : () => <div>Not Found</div>;
  }, [activeItem]);

  React.useEffect(() => {
    document.title = `${t("app.title")} v${__APP_VERSION__}`;
  }, [t]);

  return (
    <div className="app-container">
      <div className="title-bar-drag-region">
        <div className="title-bar-content">
          <img src={icon} alt="App Icon" className="title-bar-icon" />
          <span className="title-bar-text">
            {t("app.title")} v{__APP_VERSION__}
          </span>
        </div>
        <div className="window-controls">
          <button
            className="window-control-btn minimize-btn"
            onClick={() => window.electronAPI.minimizeWindow()}
            title="Minimize"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <button
            className="window-control-btn close-btn"
            onClick={() => window.electronAPI.closeWindow()}
            title="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      <Sidebar activeTabId={activeTabId} onTabChange={setActiveTabId} />
      <main className="content">
        {activeItem && (
          <header className="content-header">
            <h1>{t(activeItem.label)}</h1>
            {activeItem.description && <p>{t(activeItem.description)}</p>}
          </header>
        )}
        <div className="content-body">
          <ActiveComponent onNavigate={setActiveTabId} />
        </div>
        <footer className="branding-footer">
          <a
            href="https://github.com/NERDHEAD-lab/Endfield-Optimization-for-Chen"
            target="_blank"
            rel="noopener noreferrer"
            className="branding-link"
          >
            <span>POWERED BY NERDHEAD LAB</span>
            <img
              src="src/renderer/assets/icon-github.svg"
              alt="GitHub"
              className="branding-icon"
            />
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
