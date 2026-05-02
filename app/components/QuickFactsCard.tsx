import { Card, SectionLabel, AccentBar } from "./ui";
import { FACTS, HOBBIES } from "@/app/data/site";

export default function QuickFactsCard() {
  return (
    <Card id="quick-facts">
      <SectionLabel>Quick Facts</SectionLabel>
      <AccentBar />
      <div style={{ marginBottom: 22 }}>
        {FACTS.map(({ key, val }, i) => (
          <div
            key={key}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              fontSize: "0.875rem",
              color: "#3d5068",
              padding: "7px 0",
              borderBottom: i < FACTS.length - 1 ? "1px solid #dde2ea" : "none",
            }}
          >
            <span className="fact-key">{key}</span>
            <span>{val}</span>
          </div>
        ))}
      </div>

      <SectionLabel>Outside Work</SectionLabel>
      <AccentBar />
      <div>
        {HOBBIES.map(({ title, desc }, i) => (
          <div
            key={title}
            style={{
              padding: "8px 0",
              borderBottom: i < HOBBIES.length - 1 ? "1px solid #dde2ea" : "none",
            }}
          >
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a2235", marginBottom: 2 }}>
              {title}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#7a90a8", lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
