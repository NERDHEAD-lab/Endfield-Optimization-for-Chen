import React from "react";
import { useTranslation } from "react-i18next";

import githubIcon from "../../assets/icon-github.svg";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="settings-page flex-1 flex flex-col justify-between">
      <div>
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
