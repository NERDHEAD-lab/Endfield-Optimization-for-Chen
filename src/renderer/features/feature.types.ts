import React from "react";

export type MenuSection = "header" | "body" | "footer";

/**
 * Properties passed to feature components.
 */
export interface IFeatureComponentProps {
  /** Callback to navigate to a different feature by its ID */
  onNavigate?: (id: string) => void;
}

/**
 * Represents a menu navigation item associated with a feature.
 */
export interface IMenuFeature {
  /** Unique identifier for the menu item */
  id: string;
  /** Internationalization key for the menu label */
  label: string;
  /** Internationalization key for the menu description */
  description?: string;
  /** Material Symbol name or image URL for the icon */
  icon?: string;
  /** List of storage keys that this feature is allowed to access */
  usingKeys?: string[];
  /** Sidebar section where the menu item should be located */
  section: MenuSection;
  /** Display priority (lower values appear first) */
  priority: number;
  /** React component to render when the menu item is active */
  component: React.ComponentType<IFeatureComponentProps>;
}

/**
 * Represents a module containing one or more features.
 */
export interface IFeatureModule {
  /** Single feature or collection of features provided by this module */
  menu: IMenuFeature | IMenuFeature[];
}
