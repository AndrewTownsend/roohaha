import { Card, SectionLabel, AccentBar } from "./ui";

export default function CurrentlyCard() {
  return (
    <Card id="currently">
      <SectionLabel>Currently</SectionLabel>
      <AccentBar />
      <div
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#1a2235",
          marginBottom: 2,
        }}
      >
        Senior Engineer, Team Lead
      </div>
      <div
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "0.875rem",
          color: "#7a90a8",
          marginBottom: 10,
        }}
      >
        Craft Education · 2025–Present
      </div>
      <p style={{ fontSize: "0.875rem", color: "#3d5068", lineHeight: 1.6 }}>
        Leading a team building DOL-compliant apprenticeship tooling — automating registration,
        document signing, and program tracking for apprentices nationwide. Greenfield TypeScript
        services integrated with several disparate external vendors.
      </p>
    </Card>
  );
}
