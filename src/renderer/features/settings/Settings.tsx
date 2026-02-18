import React from "react";
import { useTranslation } from "react-i18next";

import githubIcon from "../../assets/icon-github.svg";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="settings-page p-8 h-full flex flex-col justify-between">
      <div>
        <h1>Information</h1>
        <div className="card">
          <p>
            Version: v{__APP_VERSION__} ({__APP_HASH__})
          </p>
        </div>
      </div>

      <div className="branding-footer">
        <a
          href="https://github.com/NERDHEAD-lab/Endfield-Optimization-for-Chen"
          target="_blank"
          rel="noopener noreferrer"
          className="branding-link"
        >
          <span>POWERED BY NERDHEAD LAB</span>
          <img src={githubIcon} alt="GitHub" className="branding-icon" />
        </a>
      </div>
    </div>
  );
};

export default Settings;
