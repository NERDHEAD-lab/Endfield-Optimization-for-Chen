import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";

import icon from "./assets/icon.ico";
import { UpdateStatus } from "../shared/types";
import { Sidebar } from "./components/Sidebar";
import UpdateModal from "./components/UpdateModal";
import { FeatureContextProvider, LauncherContextProvider } from "./context";
import { getMenuItems } from "./features";
import "./App.css";

const NotFound = () => <div>Not Found</div>;

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

  const ActiveComponent = activeItem ? activeItem.component : NotFound;

  // --- Auto Update State ---
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    state: "idle",
  });

  useEffect(() => {
    document.title = `${t("app.title")} v${__APP_VERSION__}`;

    // Listen for update status
    globalThis.electronAPI.on("update-status-change", (status: unknown) => {
      setUpdateStatus(status as UpdateStatus);
    });

    // Initial check (silent)
    globalThis.electronAPI.send("UI_UPDATE_CHECK", { isSilent: true });

    return () => {};
  }, [t]);

  const handleUpdate = () => {
    globalThis.electronAPI.send("UI_UPDATE_DOWNLOAD");
  };

  const handleInstall = () => {
    globalThis.electronAPI.send("UI_UPDATE_INSTALL");
  };

  const handleCloseUpdateModal = () => {
    setUpdateStatus((prev) => ({ ...prev, state: "idle" }));
  };

  return (
    <LauncherContextProvider>
      <div className="app-container">
        <UpdateModal
          status={updateStatus}
          onUpdate={handleUpdate}
          onInstall={handleInstall}
          onClose={handleCloseUpdateModal}
        />

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
              onClick={() => globalThis.electronAPI.minimizeWindow()}
              title="Minimize"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <button
              className="window-control-btn close-btn"
              onClick={() => globalThis.electronAPI.closeWindow()}
              title="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        <Sidebar activeTabId={activeTabId} onTabChange={setActiveTabId} />
        <main className="content">
          <FeatureContextProvider activeFeature={activeItem || null}>
            {activeItem && (
              <header className="content-header">
                <h1>{t(activeItem.label)}</h1>
                {activeItem.description && <p>{t(activeItem.description)}</p>}
              </header>
            )}
            <div className="content-body">
              <ActiveComponent onNavigate={setActiveTabId} />
            </div>
          </FeatureContextProvider>
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
    </LauncherContextProvider>
  );
}

export default App;
