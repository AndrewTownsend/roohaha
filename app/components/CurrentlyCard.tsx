import { Card, SectionLabel, AccentBar } from "./ui";

export default function CurrentlyCard() {
  return (
    <Card id="currently">
      <SectionLabel>Currently</SectionLabel>
      <AccentBar />
      <div
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#1a2235",
          marginBottom: 2,
        }}
      >
        Senior Engineer
      </div>
      <div
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "0.875rem",
          color: "#7a90a8",
          marginBottom: 10,
        }}
      >
        Adduro · 2026–Present
      </div>
      <p style={{ fontSize: "0.875rem", color: "#3d5068", lineHeight: 1.6 }}>
        Third engineer at a streaming ad platform built on a radical idea — show advertisers what
        their ads actually did, instead of asking them to take it on faith. TypeScript, C#, and Golang.
      </p>
    </Card>
  );
}
