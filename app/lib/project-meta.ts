import type { ProjectStatus } from "@/app/types";

export const PROJECT_STATUS_DOT: Record<ProjectStatus, string> = {
  planned:  "rgba(74,127,165,0.55)",
  building: "#d4a04a",
  beta:     "#7b6cc7",
  shipped:  "#4ea372",
  paused:   "#a0a8b4",
};

export const PROJECT_STATUS_TEXT_ON_LIGHT: Record<ProjectStatus, string> = {
  planned:  "#4a7fa5",
  building: "#b08838",
  beta:     "#6558b5",
  shipped:  "#3e8a5e",
  paused:   "#8a93a0",
};

export const PROJECT_STATUS_TEXT_ON_DARK: Record<ProjectStatus, string> = {
  planned:  "#4a7fa5",
  building: "#d4a04a",
  beta:     "#7b6cc7",
  shipped:  "#4ea372",
  paused:   "#a0a8b4",
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planned:  "Planning",
  building: "Building",
  beta:     "Beta",
  shipped:  "Shipped",
  paused:   "Paused",
};

export const PROJECT_STATUS_TRACKER_STAGE: Partial<Record<ProjectStatus, string>> = {
  planned:  "Planning",
  building: "In development",
  beta:     "Beta",
  shipped:  "Shipped",
};

export const PROJECT_STATUS_OPTIONS: readonly ProjectStatus[] = [
  "planned", "building", "beta", "shipped", "paused",
];

export const PROJECT_STATUS_TRACKER_STAGES = [
  "Planning",
  "In development",
  "Beta",
  "Shipped",
] as const;
