import Link from "next/link";
import Footer from "@/app/components/Footer";
import { LogoSvg } from "@/app/components/icons";

// Layout for a project's supporting documents — support, privacy, and anything
// else that hangs off a project page. Deliberately not ProjectShell: that one
// leads with the project's status, tagline, and description, which is the right
// frame for "here is the thing" and the wrong one for "here is its privacy
// policy". This keeps the same chrome and typography without the sales pitch.
export default function DocShell({
  title,
  subtitle,
  updated,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  subtitle?: string;
  updated?: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
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
              href={backHref}
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 12,
                color: "#5a7088",
                textDecoration: "none",
                letterSpacing: "0.03em",
              }}
            >
              ← {backLabel}
            </Link>
          </div>
        </nav>
      </header>

      <div style={{ background: "#1a2235", borderBottom: "1px solid #243048" }}>
        <div
          style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 36px 44px" }}
          className="max-md:px-4 max-md:py-8"
        >
          {updated && (
            <div
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#5a7088",
                marginBottom: 20,
              }}
            >
              Last updated {updated}
            </div>
          )}

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
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "1.05rem",
                color: "#8da0b8",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <main id="main-content" style={{ background: "#f0f2f5", minHeight: "40vh" }}>
        <div
          style={{ maxWidth: 760, margin: "0 auto", padding: "48px 36px 64px" }}
          className="max-md:px-4 max-md:py-8"
        >
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}

// Section heading, matching the project pages' h2 treatment.
export function DocHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-syne), sans-serif",
        fontWeight: 700,
        fontSize: "1.1rem",
        color: "#1a2235",
        margin: "0 0 12px",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h2>
  );
}

// Body copy. Long-form prose, so the line height is looser than the cards.
export function DocText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-space-grotesk), sans-serif",
        fontSize: "0.95rem",
        lineHeight: 1.7,
        color: "#3d5068",
        margin: "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}
