import { Card, SectionLabel, AccentBar } from "./ui";

export default function WritingCard() {
  return (
    <Card id="writing" variant="writing">
      <SectionLabel>Writing</SectionLabel>
      <AccentBar />
      <div
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 12,
          color: "#7a90a8",
          textAlign: "center",
          padding: "20px 0",
          opacity: 0.7,
        }}
      >
        blog posts coming soon
      </div>
    </Card>
  );
}
