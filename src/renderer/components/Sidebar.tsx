import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useLauncherContext } from "../context/LauncherContext";
import { getMenuItems } from "../features";
import { SidebarItem } from "./SidebarItem";
import "./Sidebar.css";

interface SidebarProps {
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTabId,
  onTabChange,
}) => {
  useTranslation();
  const { favorites, customOrder, toggleFavorite, setCustomOrder } =
    useLauncherContext();

  // Initial raw items from registry
  const allFeatures = useMemo(() => getMenuItems(), []);

  // Handler: Toggle Favorite (with propagation stop)
  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  // State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Handler: Drag Start
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    // Set transparent drag image or similar if needed
  };

  // Handler: Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handler: Drop
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetId) return;

    // Reorder customOrder based on separate lists logic
    // But here we need to know the full list order.
    // For simplicity, we'll reorder the 'customOrder' array which tracks ALL body items key order.

    // If customOrder is empty (first run), initialize it with priority order
    let currentOrder = [...customOrder];
    if (currentOrder.length === 0) {
      const bodyFeatures = allFeatures.filter((f) => f.section === "body");
      currentOrder = bodyFeatures.map((f) => f.id);
    }

    const fromIndex = currentOrder.indexOf(draggedItemId);
    const toIndex = currentOrder.indexOf(targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      const newOrder = [...currentOrder];
      newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, draggedItemId);
      setCustomOrder(newOrder);
    }

    setDraggedItemId(null);
  };

  // --- Rendering Logic ---

  const headerItems = allFeatures.filter((show) => show.section === "header");
  const footerItems = allFeatures.filter((show) => show.section === "footer");

  // Body Items Logic:
  // 1. Filter body items
  // 2. Sort by custom order (or priority if no custom order)
  // 3. Sort by Favorites (Favorites always on top)
  const bodyItems = useMemo(() => {
    const items = allFeatures.filter((f) => f.section === "body");

    // Apply Custom Order
    if (customOrder.length > 0) {
      items.sort((a, b) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        // If items are new and not in customOrder, append them at the end
        if (indexA === -1 && indexB === -1) return a.priority - b.priority;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    // Apply Favorites (Favorites float to top)
    const pinned = items.filter((i) => favorites.includes(i.id));
    const unpinned = items.filter((i) => !favorites.includes(i.id));

    return [...pinned, ...unpinned];
  }, [allFeatures, customOrder, favorites]);

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Endfield Tool</h2>
      </div>

      <div className="sidebar-section">
        <ul className="sidebar-menu">
          {/* Header */}
          {headerItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={activeTabId === item.id}
              isFavorite={false}
              onClick={() => onTabChange(item.id)}
              onToggleFavorite={() => {}}
              draggable={false}
            />
          ))}
        </ul>
      </div>

      {headerItems.length > 0 && bodyItems.length > 0 && (
        <div className="sidebar-divider" />
      )}

      <div className="sidebar-section body-section">
        <ul className="sidebar-menu">
          {/* Body (Draggable) */}
          {bodyItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={activeTabId === item.id}
              isFavorite={favorites.includes(item.id)}
              onClick={() => onTabChange(item.id)}
              onToggleFavorite={(e) => handleToggleFavorite(e, item.id)}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
            />
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <ul className="sidebar-menu">
          {footerItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={activeTabId === item.id}
              isFavorite={false}
              onClick={() => onTabChange(item.id)}
              onToggleFavorite={() => {}}
              draggable={false}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};
