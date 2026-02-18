import PatchNotes from "./PatchNotes";
import { IFeatureModule } from "../feature.types";

export const PatchNotesFeature: IFeatureModule = {
  menu: {
    id: "patch-notes",
    label: "sidebar.patchnotes",
    icon: "update",
    section: "footer",
    priority: 999,
    component: PatchNotes,
    description: "sidebar.patchnotes", // Using label key as description placeholder or add new key
  },
};
