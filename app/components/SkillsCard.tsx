import { Card, SectionLabel, AccentBar } from "./ui";
import { SKILLS } from "@/app/data/site";

export default function SkillsCard() {
  return (
    <Card section="skills">
      <SectionLabel>Skills</SectionLabel>
      <AccentBar />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
        {SKILLS.map((skill) => (
          <span key={skill} className="skill-pill">
            {skill}
          </span>
        ))}
      </div>
    </Card>
  );
}
