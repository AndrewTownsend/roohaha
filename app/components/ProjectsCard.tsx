import { Card, SectionLabel, AccentBar } from "./ui";
import type { Project } from "@/app/types";
import { PROJECT_STATUS_DOT, PROJECT_STATUS_TEXT_ON_LIGHT } from "@/app/lib/project-meta";
import { ProjectLinkIcon } from "./icons";

function ProjectRow({
  project,
  isFirst,
  isLast,
}: {
  project: Project;
  isFirst: boolean;
  isLast: boolean;
}) {
  const dotColor = PROJECT_STATUS_DOT[project.status];
  const textColor = PROJECT_STATUS_TEXT_ON_LIGHT[project.status];

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        paddingTop: isFirst ? 2 : 12,
        paddingBottom: isLast ? 0 : 12,
        borderBottom: isLast ? "none" : "1px solid #dde2ea",
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
          marginTop: 8,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              lineHeight: 1.3,
              color: "#1a2235",
            }}
          >
            {project.title}
          </span>
          {project.meta && (
            <span
              className="pj-meta"
              style={{
                fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#7a90a8",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {project.meta}
            </span>
          )}
        </div>

        {project.desc && (
          <p
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontSize: "0.875rem",
              lineHeight: 1.5,
              color: "#3d5068",
              margin: "0 0 8px",
            }}
          >
            {project.desc}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: dotColor,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: textColor,
            }}
          >
            {project.statusLabel}
          </span>
        </div>

        {project.links.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {project.links.map((link) => (
                <a
                  key={`${link.kind}-${link.href}`}
                  href={link.href}
                  className={link.primary ? "pj-chip pj-chip-primary" : "pj-chip"}
                  style={{ fontSize: 11, padding: "4px 10px" }}
                  {...(link.kind !== "page" && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <ProjectLinkIcon kind={link.kind} />
                  {link.label}
                </a>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectsCardProps {
  projects: Project[];
}

export default function ProjectsCard({ projects }: ProjectsCardProps) {
  return (
    <div className="pj-container">
      <Card id="projects">
        <SectionLabel>Projects</SectionLabel>
        <AccentBar />
        <div>
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              isFirst={i === 0}
              isLast={i === projects.length - 1}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
