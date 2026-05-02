import { Card, SectionLabel, AccentBar } from "./ui";
import { HIGHLIGHT_GROUPS, type HighlightGroup, type Highlight } from "@/app/data/site";

function HighlightRow({ title, sub }: Highlight) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div className="highlight-dot" />
      <div>
        <div className="highlight-title">{title}</div>
        <div className="highlight-sub">{sub}</div>
      </div>
    </div>
  );
}

function HighlightSection({ label, highlights }: HighlightGroup) {
  return (
    <div>
      {label && <div className="group-badge">{label}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {highlights.map((h) => (
          <HighlightRow key={h.title} {...h} />
        ))}
      </div>
    </div>
  );
}

export default function RecentHighlightsCard() {
  return (
    <Card id="highlights">
      <SectionLabel>Recent Highlights</SectionLabel>
      <AccentBar />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {HIGHLIGHT_GROUPS.map((group, i) => (
          <HighlightSection key={i} {...group} />
        ))}
      </div>
    </Card>
  );
}
