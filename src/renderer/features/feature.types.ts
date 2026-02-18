import React from "react";

export type MenuSection = "header" | "body" | "footer";

export interface IFeatureComponentProps {
  onNavigate?: (id: string) => void;
}

export interface IMenuFeature {
  id: string;
  label: string; // i18n key
  section: MenuSection;
  priority: number; // Lower number = Higher priority
  component: React.ComponentType<IFeatureComponentProps>;
}

export interface IFeatureModule {
  menu: IMenuFeature | IMenuFeature[];
}
