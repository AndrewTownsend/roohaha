import { Card, SectionLabel, AccentBar } from "./ui";
import { readContributions } from "@/app/lib/github";
import ContributionGrid from "./ContributionGrid";

const STATS = [
  { key: "commits",      label: "Commits" },
  { key: "pullRequests", label: "Pull Requests" },
  { key: "codeReviews", label: "Code Reviews" },
] as const;

export default async function ContributionGraph() {
  let data;
  try {
    data = await readContributions();
  } catch {
    // Don't break the page if GitHub is unreachable or the PAT is missing.
    return null;
  }

  const { weeks, totalContributions, commits, pullRequests, codeReviews } = data;

  const statValues = { commits, pullRequests, codeReviews };

  return (
    <Card id="activity">
      <SectionLabel>GitHub Activity</SectionLabel>
      <AccentBar />

      {/* Commit / PR / Review counts */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 24, marginBottom: 5 }}>
          {STATS.map(({ key, label }) => (
            <div key={key}>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1a2235",
                  lineHeight: 1.2,
                }}
              >
                {statValues[key].toLocaleString()}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 10,
                  color: "#7a90a8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: 2,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 10,
            color: "#b0bec9",
          }}
        >
          (past 12 months)
        </div>
      </div>

      <ContributionGrid weeks={weeks} totalContributions={totalContributions} />
    </Card>
  );
}
