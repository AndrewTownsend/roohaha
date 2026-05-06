import Link from "next/link";
import Nav from "@/app/components/Nav";
import { signInWithGitHub } from "./actions";
import CenterBoot from "./blocks/CenterBoot";
import CenterNuke from "./blocks/CenterNuke";
import CenterGeo from "./blocks/CenterGeo";
import { monoFont } from "./blocks/shared";

export const dynamic = "force-dynamic";

const SUBHEADS = [
  "// trespassers will be deserialized · be cool",
  "// connection traced · awaiting handshake",
  "// follow the white rabbit",
] as const;

const CENTER_BLOCKS = [CenterBoot, CenterNuke, CenterGeo] as const;

function GitHubMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default async function SignInPage() {
  // eslint-disable-next-line react-hooks/purity -- Server Component, safe to use Math.random()
  const subhead = SUBHEADS[Math.floor(Math.random() * SUBHEADS.length)];
  // eslint-disable-next-line react-hooks/purity -- Server Component, safe to use Math.random()
  const CenterBlock = CENTER_BLOCKS[Math.floor(Math.random() * CENTER_BLOCKS.length)];

  return (
    <div style={{ height: "100vh", background: "#0d141f", display: "flex", flexDirection: "column" }}>
      <header style={{ background: "#1a2235", flexShrink: 0, position: "sticky", top: 0, zIndex: 50 }}>
        <Nav />
      </header>
      <div className="terminal-page" style={{ flex: 1, minHeight: 0 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 540,
          background: "#111a26",
          border: "1px solid #1f2d3f",
          borderRadius: 8,
          boxShadow: "0 0 0 1px rgba(74,127,165,0.08), 0 30px 60px -20px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 14px",
            background: "#0c131c",
            borderBottom: "1px solid #1f2d3f",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4a3340", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4a4232", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2f4a3a", display: "inline-block" }} />
          <span
            style={{
              marginLeft: 12,
              fontFamily: monoFont,
              fontSize: 11,
              color: "#5a7088",
              letterSpacing: "0.06em",
            }}
          >
            root@roohaha:<span style={{ color: "#6a9fc5" }}>~/admin</span> — signin
          </span>
        </div>

        <div style={{ padding: "28px 32px 32px" }}>
          <div
            style={{
              fontFamily: monoFont,
              fontSize: 12,
              color: "#5a7088",
              marginBottom: 6,
              letterSpacing: "0.04em",
            }}
          >
            <span style={{ color: "#4a7fa5", marginRight: 8 }}>▸</span>
            <span style={{ color: "#c9d6e2" }}>auth --target=/admin</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#e8f0f8",
              letterSpacing: "-0.02em",
              margin: "14px 0 4px",
            }}
          >
            who goes <span style={{ color: "#6a9fc5" }}>there?</span>
          </h1>

          <div
            style={{
              fontFamily: monoFont,
              fontSize: 12,
              color: "#5a7088",
              marginBottom: 24,
              letterSpacing: "0.03em",
            }}
          >
            {subhead}
            <span className="terminal-cursor" />
          </div>

          <CenterBlock />

          <form action={signInWithGitHub}>
            <button type="submit" className="terminal-gh-btn">
              <GitHubMark />
              <span style={{ flex: 1 }}>Sign in with GitHub</span>
              <span style={{ color: "#6a9fc5", fontSize: 14, letterSpacing: 0 }}>↗</span>
            </button>
          </form>

          <div
            style={{
              marginTop: 22,
              paddingTop: 16,
              borderTop: "1px dashed #1f2d3f",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: monoFont,
              fontSize: 10,
              color: "#3d5068",
              letterSpacing: "0.1em",
            }}
          >
            <span>
              <span style={{ color: "#4a7fa5" }}>●</span> session: pending
            </span>
            <Link
              href="/"
              className="terminal-back-link"
              style={{ fontFamily: monoFont, fontSize: 10, letterSpacing: "0.1em" }}
            >
              cd ../
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
