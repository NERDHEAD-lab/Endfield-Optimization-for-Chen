import React from "react";
import { useTranslation } from "react-i18next";

import "./UpdateModal.css";
import { UpdateStatus } from "../../shared/types";

interface UpdateModalProps {
  status: UpdateStatus;
  onUpdate: () => void; // Trigger Download
  onInstall: () => void; // Trigger Restart & Install
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  status,
  onUpdate,
  onInstall,
  onClose,
}) => {
  const { t } = useTranslation();

  const isVisible =
    status.state !== "idle" || (status.error && status.error.length > 0);

  if (!isVisible) return null;

  const getStatusMessage = () => {
    switch (status.state) {
      case "checking":
        return t("update.status.checking");
      case "available":
        return t("update.status.available", { version: status.version });
      case "downloading":
        return t("update.status.downloading", {
          progress: Math.floor(status.progress || 0),
        });
      case "downloaded":
        return t("update.status.downloaded");
      case "error":
        return `${status.error}`;
      default:
        return t("update.status.idle");
    }
  };

  const isDownloading = status.state === "downloading";
  const isDownloaded = status.state === "downloaded";
  const isAvailable = status.state === "available";

  return (
    <div className="update-modal-overlay">
      <div className="update-modal-content">
        <div className="update-modal-header">
          <h3>{t("update.title")}</h3>
        </div>
        <div className="update-modal-body">
          <p>{getStatusMessage()}</p>
          {isDownloading && (
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${status.progress || 0}%` }}
              />
            </div>
          )}
        </div>
        <div className="update-modal-footer">
          {isDownloaded ? (
            <button className="btn-update-primary" onClick={onInstall}>
              {t("update.button.install")}
            </button>
          ) : (
            isAvailable && (
              <button
                className={`btn-update-primary ${isDownloading ? "disabled" : ""}`}
                onClick={onUpdate}
                disabled={isDownloading}
              >
                {t("update.button.update")}
              </button>
            )
          )}
          <button className="btn-update-secondary" onClick={onClose}>
            {t("update.button.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
