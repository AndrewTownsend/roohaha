"use client";

import { useState } from "react";
import ReadingForm from "./ReadingForm";
import PlayingForm from "./PlayingForm";
import ProjectsForm from "./ProjectsForm";
import FeatureGatesForm from "./FeatureGatesForm";
import type { Book, Game } from "@/app/types";
import type { AdminProject } from "@/app/lib/projects-admin";
import type { FeatureGates } from "@/app/lib/feature-gates";

const MONO = "var(--font-dm-mono), monospace";

type TabId = "projects" | "reading" | "playing" | "gates";

const TABS: { id: TabId; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "reading", label: "Reading" },
  { id: "playing", label: "Playing" },
  { id: "gates", label: "Feature Gates" },
];

const SESSION_KEY = "admin:tab";

function readStoredTab(): TabId {
  if (typeof window === "undefined") return "projects";
  const saved = sessionStorage.getItem(SESSION_KEY) as TabId | null;
  return saved && TABS.some((t) => t.id === saved) ? saved : "projects";
}

export default function AdminTabs({
  initialReading,
  initialPlaying,
  initialProjects,
  initialGates,
}: {
  initialReading: Book[];
  initialPlaying: Game[];
  initialProjects: AdminProject[];
  initialGates: FeatureGates;
}) {
  const [active, setActive] = useState<TabId>(readStoredTab);

  function switchTab(id: TabId) {
    setActive(id);
    sessionStorage.setItem(SESSION_KEY, id);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Admin sections"
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1.5px solid #dde2ea",
          marginBottom: 28,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            aria-controls="admin-tabpanel"
            onClick={() => switchTab(tab.id)}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: active === tab.id ? "#1a2235" : "#8a9ab0",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${active === tab.id ? "#1a2235" : "transparent"}`,
              padding: "8px 16px 8px 0",
              cursor: "pointer",
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="admin-tabpanel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
      >
        {active === "projects" && <ProjectsForm initialProjects={initialProjects} />}
        {active === "reading" && <ReadingForm initialReading={initialReading} />}
        {active === "playing" && <PlayingForm initialPlaying={initialPlaying} />}
        {active === "gates" && <FeatureGatesForm initialGates={initialGates} />}
      </div>
    </div>
  );
}
