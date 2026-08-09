import type { Metadata } from "next";
import ProjectShell from "../_components/ProjectShell";

export const metadata: Metadata = {
  title: "Reticle — roohaha.com",
  description:
    "Reticle is a lightweight screenshot and annotation tool for Apple Silicon Macs, built to replace Lightshot as it loses support for Intel-only apps.",
};

const FEATURES = [
  { label: "Region capture", detail: "Drag to select any area of the screen with a crosshair reticle" },
  { label: "Quick annotate", detail: "Lines, boxes, text, and highlights before you save or share" },
  { label: "Save to disk or copy to clipboard", detail: "Captures can either be saved for later and pasted immediately" },
  { label: "Global hotkey", detail: "Initiate capture from anywhere without touching the mouse" },
  { label: "Native performance", detail: "Built for Apple Silicon from the ground up — no Rosetta, no lag" },
];

export default function ReticlePage() {
  return (
    <ProjectShell slug="reticle">
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#1a2235",
            margin: "0 0 16px",
            letterSpacing: "-0.01em",
          }}
        >
          Planned features
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FEATURES.map(({ label, detail }) => (
            <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(74,127,165,0.55)",
                  flexShrink: 0,
                  marginTop: 7,
                }}
              />
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#1a2235",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "0.9rem",
                    color: "#5a7088",
                  }}
                >
                  {" — "}
                  {detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#1a2235",
            margin: "0 0 16px",
            letterSpacing: "-0.01em",
          }}
        >
          Tech
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Stack", detail: "Swift, SwiftUI, AppKit" },
            { label: "Platforms", detail: "macOS — Apple Silicon only" },
          ].map(({ label, detail }) => (
            <div key={label}>
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#1a2235",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "0.9rem",
                  color: "#5a7088",
                }}
              >
                {" — "}
                {detail}
              </span>
            </div>
          ))}
        </div>
      </section>
    </ProjectShell>
  );
}
