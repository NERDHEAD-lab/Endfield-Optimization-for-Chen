import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { IMenuFeature } from "../features/feature.types";
import "./FeatureModal.css";

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: IMenuFeature | null;
}

const FeatureModal: React.FC<FeatureModalProps> = ({
  isOpen,
  onClose,
  feature,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300); // Animation duration
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;
  if (!feature) return null;

  const FeatureComponent = feature.component;

  return (
    <div className={`feature-modal-overlay ${isOpen ? "open" : "closing"}`}>
      <div className="feature-modal-content">
        <div className="feature-modal-header">
          <h2>{t(feature.label)}</h2>
          <button className="close-button" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="feature-modal-body">
          <FeatureComponent />
        </div>
      </div>
    </div>
  );
};

export default FeatureModal;
