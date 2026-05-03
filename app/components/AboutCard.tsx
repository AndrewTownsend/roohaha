import { Card, SectionLabel, AccentBar } from "./ui";

const TAGS = [
  "Early-stage startups",
  "Fortune 10",
  "Full Stack",
  "Team Lead",
  "Distributed Systems",
] as const;

export default function AboutCard() {
  return (
    <Card id="about">
      <SectionLabel>About</SectionLabel>
      <AccentBar />
      <p style={{ fontSize: "0.95rem", color: "#3d5068", lineHeight: 1.65, marginBottom: 14 }}>
        Senior Full Stack Software Engineer with deep experience across the full stack — from
        crafting intuitive front-ends to architecting large-scale backend systems. I work well
        independently, thrive in ambiguity, ship quickly without breaking things, and regularly
        use AI as a collaborative tool in my workflow.
      </p>
      <p style={{ fontSize: "0.875rem", color: "#5a7088", lineHeight: 1.6, marginBottom: 14 }}>
        From early-stage startups of under 10 people to Fortune 10 enterprises, building systems
        at every scale. Greenfield products, high-availability distributed backends, and everything
        in between — for nearly two decades.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {TAGS.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 11,
              border: "1.5px solid #4a7fa5",
              color: "#4a7fa5",
              borderRadius: 20,
              padding: "3px 10px",
              opacity: 0.85,
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
