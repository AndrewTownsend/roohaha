import type { Metadata } from "next";
import Link from "next/link";
import ProjectShell from "../_components/ProjectShell";

export const metadata: Metadata = {
  title: "Reticle — roohaha.com",
  description:
    "A lightweight screenshot and annotation tool for Apple silicon Macs. Press a hotkey, drag a region, mark it up, then copy or save it. Nothing leaves your Mac.",
};

// Only what the app actually does. Anything aspirational belongs in a commit,
// not here — this page is the App Store marketing URL, and App Review opens it.
const FEATURES = [
  {
    label: "Region capture",
    detail:
      "Drag a crosshair over any part of the screen, with a live pixel readout so you can hit an exact size",
  },
  {
    label: "Markup",
    detail:
      "Lines, arrows, rectangles, ellipses, and text labels — in any colour, at three stroke weights",
  },
  {
    label: "Copy or save",
    detail:
      "Command-C flattens it onto the clipboard; Command-S writes a PNG wherever you choose",
  },
  {
    label: "Global hotkey",
    detail:
      "Start a capture from anywhere with Command-Shift-9, or record a shortcut of your own",
  },
  {
    label: "Menu bar only",
    detail: "No Dock icon and no window — it stays out of the way until you press the key",
  },
  {
    label: "Correct on every display",
    detail:
      "Captures at each display's true resolution, including setups that mix Retina and non-Retina screens",
  },
  {
    label: "Nothing leaves your Mac",
    detail:
      "Sandboxed with no network access at all — no account, no uploads, no telemetry",
  },
];

const TECH = [
  { label: "Stack", detail: "Swift, AppKit, ScreenCaptureKit" },
  { label: "Platform", detail: "macOS 14 Sonoma or later — Apple silicon only" },
  { label: "Distribution", detail: "Mac App Store" },
];

const headingStyle = {
  fontFamily: "var(--font-syne), sans-serif",
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#1a2235",
  margin: "0 0 16px",
  letterSpacing: "-0.01em",
} as const;

const labelStyle = {
  fontFamily: "var(--font-space-grotesk), sans-serif",
  fontWeight: 600,
  fontSize: "0.9rem",
  color: "#1a2235",
} as const;

const detailStyle = {
  fontFamily: "var(--font-space-grotesk), sans-serif",
  fontSize: "0.9rem",
  color: "#5a7088",
} as const;

export default function ReticlePage() {
  return (
    <ProjectShell slug="reticle">
      <section style={{ marginBottom: 48 }}>
        <h2 style={headingStyle}>Features</h2>
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
                <span style={labelStyle}>{label}</span>
                <span style={detailStyle}>
                  {" — "}
                  {detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={headingStyle}>Tech</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TECH.map(({ label, detail }) => (
            <div key={label}>
              <span style={labelStyle}>{label}</span>
              <span style={detailStyle}>
                {" — "}
                {detail}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={headingStyle}>Support &amp; privacy</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link
            href="/projects/reticle/support"
            className="pj-chip"
            style={{ fontSize: 12, padding: "5px 12px" }}
          >
            Support
          </Link>
          <Link
            href="/projects/reticle/privacy"
            className="pj-chip"
            style={{ fontSize: 12, padding: "5px 12px" }}
          >
            Privacy policy
          </Link>
        </div>
      </section>
    </ProjectShell>
  );
}
