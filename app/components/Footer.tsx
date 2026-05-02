const LINKS = [
  { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/andrew-townsend-6876836/" },
  { label: "GitHub ↗", href: "https://github.com/AndrewTownsend" },
] as const;

export default function Footer() {
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
        <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 13, color: "#3d5068" }}>
          © Andrew Townsend · Herndon, VA
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {LINKS.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-link">
              {label}
            </a>
          ))}
        </div>
        <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, color: "#2a3a4e" }}>
          roohaha.com
        </span>
      </div>
    </footer>
  );
}
