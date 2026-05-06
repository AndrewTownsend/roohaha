import AdminLink from "./AdminLink";

const ALL_LINKS = [
  { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/andrew-townsend-6876836/", id: "linkedin" },
  { label: "GitHub ↗", href: "https://github.com/AndrewTownsend", id: "github" },
  { label: "Source ↗", href: "https://github.com/AndrewTownsend/roohaha", id: "source" },
] as const;

interface FooterProps {
  hideSource?: boolean;
}

export default function Footer({ hideSource = false }: FooterProps) {
  const links = hideSource ? ALL_LINKS.filter((l) => l.id !== "source") : ALL_LINKS;

  return (
    <footer style={{ background: "#111825", borderTop: "1px solid #1e2a3a" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 36px",
          maxWidth: 1140,
          margin: "0 auto",
        }}
        className="max-md:flex-col max-md:gap-2 max-md:items-center max-md:px-4 max-md:py-3"
      >
        <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, color: "#5a7a96" }}>
          © Andrew Townsend · Herndon, VA
        </span>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {links.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-link">
              {label}
            </a>
          ))}
          <a href="/admin/signin" className="footer-egg" title="who goes there?">
            ~/admin ›
          </a>
        </div>
        <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, color: "#4a6278", display: "flex", alignItems: "center", gap: 12 }}>
          roohaha.com
          <AdminLink />
        </span>
      </div>
    </footer>
  );
}
