import Link from "next/link";
import { notFound } from "next/navigation";
import { readAllProjects } from "@/app/lib/projects";
import Footer from "@/app/components/Footer";
import { LogoSvg, ProjectLinkIcon } from "@/app/components/icons";
import { PROJECT_STATUS_DOT, PROJECT_STATUS_TEXT_ON_DARK, PROJECT_STATUS_TRACKER_STAGES, PROJECT_STATUS_TRACKER_STAGE } from "@/app/lib/project-meta";
import StatusTracker from "./StatusTracker";
import type { Project } from "@/app/types";

function ProjectHeader({ project }: { project: Project }) {
  return (
    <div style={{ background: "#1a2235", borderBottom: "1px solid #243048" }}>
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "40px 36px 44px",
        }}
        className="max-md:px-4 max-md:py-8"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: PROJECT_STATUS_DOT[project.status],
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: PROJECT_STATUS_TEXT_ON_DARK[project.status],
            }}
          >
            {project.statusLabel}
          </span>
          {project.meta && (
            <>
              <span style={{ color: "#3d5068", fontSize: 10 }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#5a7088",
                }}
              >
                {project.meta}
              </span>
            </>
          )}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 700,
            fontSize: "2.6rem",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#f0f4f8",
            margin: "0 0 10px",
          }}
          className="max-md:text-3xl"
        >
          {project.title}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "1.05rem",
            color: "#8da0b8",
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          {project.tagline}
        </p>

      </div>
    </div>
  );
}

export default async function ProjectShell({
  slug,
  children,
}: {
  slug: string;
  children?: React.ReactNode;
}) {
  const projects = await readAllProjects();
  const project = projects.find((p) => p.id === slug);

  if (!project) notFound();

  return (
    <>
      <header style={{ background: "#111825", position: "sticky", top: 0, zIndex: 50 }}>
        <nav style={{ borderBottom: "1px solid #243048" }}>
          <div
            style={{
              maxWidth: 1140,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 36px",
            }}
            className="max-md:px-4"
          >
            <Link href="/" aria-label="roohaha home">
              <LogoSvg />
            </Link>
            <Link
              href="/#projects"
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 12,
                color: "#5a7088",
                textDecoration: "none",
                letterSpacing: "0.03em",
              }}
            >
              ← Portfolio
            </Link>
          </div>
        </nav>
      </header>

      <ProjectHeader project={project} />

      <main style={{ background: "#f0f2f5", minHeight: "40vh" }}>
        <div
          style={{ maxWidth: 760, margin: "0 auto", padding: "48px 36px 64px" }}
          className="max-md:px-4 max-md:py-8"
        >
          {project.links.some((l) => l.kind !== "page") && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
              {project.links
                .filter((l) => l.kind !== "page")
                .map((link) => (
                  <a
                    key={`${link.kind}-${link.href}`}
                    href={link.href}
                    className={link.primary ? "pj-chip pj-chip-primary" : "pj-chip"}
                    style={{ fontSize: 12, padding: "5px 12px" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ProjectLinkIcon kind={link.kind} />
                    {link.label}
                  </a>
                ))}
            </div>
          )}

          <p
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "#3d5068",
              margin: "0 0 40px",
            }}
          >
            {project.desc}
          </p>

          {children}

          {PROJECT_STATUS_TRACKER_STAGE[project.status] !== undefined && (
            <div style={{ borderTop: "1px solid #dde2ea", paddingTop: 28, marginTop: 8 }}>
              <p
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 11,
                  color: "#8a9ab0",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 20px",
                }}
              >
                Status
              </p>
              <StatusTracker
                stages={[...PROJECT_STATUS_TRACKER_STAGES]}
                current={PROJECT_STATUS_TRACKER_STAGE[project.status] ?? ""}
              />
            </div>
          )}

          {project.links.some((l) => l.kind !== "page") && (
            <div style={{ borderTop: "1px solid #dde2ea", paddingTop: 32, marginTop: 48 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {project.links
                  .filter((l) => l.kind !== "page")
                  .map((link) => (
                    <a
                      key={`${link.kind}-${link.href}`}
                      href={link.href}
                      className={link.primary ? "pj-chip pj-chip-primary" : "pj-chip"}
                      style={{ fontSize: 12, padding: "5px 12px" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ProjectLinkIcon kind={link.kind} />
                      {link.label}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
