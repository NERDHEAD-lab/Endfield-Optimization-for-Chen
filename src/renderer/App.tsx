import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getMenuItems } from "./features";
import icon from "./assets/icon.ico";
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

  const renderMenuSection = (items: IMenuFeature[]) => (
    <ul className="sidebar-menu">
      {items.map((item) => (
        <li
          key={item.id}
          className={activeTabId === item.id ? "active" : ""}
          onClick={() => setActiveTabId(item.id)}
        >
          {t(item.label)}
        </li>
      ))}
    </ul>
  );

  const headerItems = menuItems.filter((i) => i.section === "header");
  const bodyItems = menuItems.filter((i) => i.section === "body");
  const footerItems = menuItems.filter((i) => i.section === "footer");

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

        {/* Header Section */}
        {headerItems.length > 0 && renderMenuSection(headerItems)}

        {/* Body Section (Flexible Spacer if needed, simplifies structure for now) */}
        <div style={{ flex: 1 }}>
          {bodyItems.length > 0 && renderMenuSection(bodyItems)}
        </div>

        {/* Footer Section */}
        {footerItems.length > 0 && (
          <div className="sidebar-footer">{renderMenuSection(footerItems)}</div>
        )}
      </nav>
      <main className="content">
        <ActiveComponent />
      </main>
    </div>
  );
}

export default App;
