import type { Metadata } from "next";
import ProjectShell from "../_components/ProjectShell";

export const metadata: Metadata = {
  title: "Variance — roohaha.com",
  description:
    "Variance is a mobile app for tracking live poker sessions. It stores everything locally — no account, no cloud, no subscription.",
};

const FEATURES = [
  { label: "Session logging", detail: "Buy-ins, cash-outs, duration, game type, location, and mid-session add-ons" },
  { label: "Bankroll tracking", detail: "Running totals with a session-by-session breakdown across cash games and tournaments" },
  { label: "Performance analytics", detail: "Win rate, hourly rate, and ROI broken down by location, stakes, and time of day" },
  { label: "Session goals", detail: "Set a stop-loss and stop-win before you sit down, then see how often you honor them over time" },
  { label: "Health & mental state", detail: "Log your energy and focus before each session and surface how they correlate with your results" },
  { label: "Expense tracking", detail: "Tips, food, and travel factored into your real P&L — not just what you cashed out" },
  { label: "Home game ledger", detail: "Track who's in for how much and settle up at the end of a home game" },
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
            { label: "Stack", detail: "React Native, Expo, SQLite, TypeScript" },
            { label: "Platforms", detail: "iOS and Android" },
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
