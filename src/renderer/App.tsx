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

  const ActiveComponent = useMemo(() => {
    const activeItem = menuItems.find((item) => item.id === activeTabId);
    return activeItem ? activeItem.component : () => <div>Not Found</div>;
  }, [activeTabId, menuItems]);

  return (
    <div className="app-container">
      <div className="title-bar-drag-region">
        <div className="title-bar-content">
          <img src={icon} alt="App Icon" className="title-bar-icon" />
          <span className="title-bar-text">
            Endfield Optimization for Chen v{__APP_VERSION__}
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
        <ActiveComponent onNavigate={setActiveTabId} />
      </main>
    </div>
  );
}

export default App;
