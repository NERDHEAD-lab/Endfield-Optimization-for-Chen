import React from "react";
import { useTranslation } from "react-i18next";

import { IMenuFeature } from "../features/feature.types";

interface SidebarItemProps {
  item: IMenuFeature;
  isActive: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  draggable?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isFavorite,
  onClick,
  onToggleFavorite,
  onDragStart,
  onDragOver,
  onDrop,
  draggable,
}) => {
  const { t } = useTranslation();

  return (
    <li
      className={`sidebar-item ${isActive ? "active" : ""} ${draggable ? "draggable" : ""}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-id={item.id}
    >
      {item.icon && (
        <span className="sidebar-icon">
          {item.icon.includes("/") || item.icon.includes(".") ? (
            <img src={item.icon} alt="" />
          ) : (
            <span className="material-symbols-outlined">{item.icon}</span>
          )}
        </span>
      )}
      <span className="sidebar-label">{t(item.label)}</span>

      {/* Favorite Button (Only for Body items) */}
      {item.section === "body" && (
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={onToggleFavorite}
          title={isFavorite ? "Unpin" : "Pin to top"}
        >
          <span className="material-symbols-outlined">
            {isFavorite ? "star" : "star"}
          </span>
        </button>
      )}
    </li>
  );
};
