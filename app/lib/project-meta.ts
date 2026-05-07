import type { ProjectStatus } from "@/app/types";

export const PROJECT_STATUS_DOT: Record<ProjectStatus, string> = {
  building: "#d4a04a",
  shipped:  "#4ea372",
  paused:   "#a0a8b4",
  planned:  "rgba(74,127,165,0.55)",
};

export const PROJECT_STATUS_TEXT_ON_LIGHT: Record<ProjectStatus, string> = {
  building: "#b08838",
  shipped:  "#3e8a5e",
  paused:   "#8a93a0",
  planned:  "#4a7fa5",
};

export const PROJECT_STATUS_TEXT_ON_DARK: Record<ProjectStatus, string> = {
  building: "#d4a04a",
  shipped:  "#4ea372",
  paused:   "#a0a8b4",
  planned:  "#4a7fa5",
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planned:  "Planning",
  building: "Building",
  shipped:  "Shipped",
  paused:   "Paused",
};

export const PROJECT_STATUS_OPTIONS: readonly ProjectStatus[] = [
  "planned", "building", "shipped", "paused",
];
