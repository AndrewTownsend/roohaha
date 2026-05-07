import type { Metadata } from "next";
import ProjectShell from "../_components/ProjectShell";

export const metadata: Metadata = {
  title: "Variance — roohaha.com",
  description:
    "Variance is a mobile poker session tracker. Log buy-ins, cash-outs, and location. Track your hourly rate, win rate, and bankroll — all stored locally on your device.",
};

const FEATURES = [
  { label: "Session logging", detail: "Buy-in, cash-out, duration, location, game type" },
  { label: "Profit & loss", detail: "Running bankroll graph with session-by-session breakdown" },
  { label: "Hourly rate", detail: "Automatically calculated per session and as a rolling average" },
  { label: "Win rate by format", detail: "Separate tracking for cash games and tournaments" },
  { label: "Location breakdown", detail: "See where you play best — and worst" },
  { label: "Local-first", detail: "No account, no cloud sync — your data stays on your device" },
];

export default function VariancePage() {
  return (
    <ProjectShell slug="variance">
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

      <div
        style={{
          borderTop: "1px solid #dde2ea",
          paddingTop: 28,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 11,
            color: "#8a9ab0",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 8px",
          }}
        >
          Status
        </p>
        <p
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "0.875rem",
            color: "#5a7088",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          In early planning. No timeline yet — this page will fill out as the design takes shape.
        </p>
      </div>
    </ProjectShell>
  );
}
