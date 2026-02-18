import React from "react";
import { useTranslation } from "react-i18next";
import { getMenuItems } from "../";
import { IFeatureComponentProps } from "../feature.types";

const Home: React.FC<IFeatureComponentProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const bodyItems = getMenuItems().filter((item) => item.section === "body");

  return (
    <div className="">
      <div className="dashboard-grid">
        <div className="card">
          <h3>Quick Tools</h3>
          <ul className="quick-tools-list">
            {bodyItems.map((item) => (
              <li
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className="quick-tool-item"
              >
                {t(item.label)}
              </li>
            ))}
            {bodyItems.length === 0 && (
              <li className="text-gray-500">No tools available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
