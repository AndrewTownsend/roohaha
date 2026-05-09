import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const VARIANTS = [
  {
    heading: "Nothing here but tumbleweeds.",
    body: "This page wandered off to chase a rabbit and never came back. The rest of the site is still in one piece — promise.",
  },
  {
    heading: "This route doesn't exist.",
    body: "You've reached the end of the map. No page, no redirect, no clever error handling — just you and this message. Head home and try again.",
  },
  {
    heading: "You found the void.",
    body: "Whatever you were looking for isn't here. It may never have been. The homepage is a better bet.",
  },
  {
    heading: "Hm. That's not a page.",
    body: "You either followed a bad link, or I made one. Either way, nothing's here. Let's get you back somewhere useful.",
  },
  {
    heading: "Lost?",
    body: "This page doesn't exist — but the rest of the site does.",
  },
] as const;

function pickVariant() {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

async function NotFoundContent() {
  await connection();
  const { heading, body } = pickVariant();
  return (
    <main
        id="main-content"
        style={{
          background: "#f0f2f5",
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 700,
            fontSize: "6rem",
            lineHeight: 1.3,
            letterSpacing: "-0.04em",
            color: "#4a7fa5",
            marginBottom: 4,
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#1a2235",
            marginBottom: 14,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            textWrap: "balance",
          }}
        >
          {heading}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "1rem",
            color: "#3d5068",
            maxWidth: 420,
            lineHeight: 1.6,
            marginBottom: 32,
            textWrap: "balance",
          }}
        >
          {body}
        </p>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: 14,
            fontWeight: 600,
            background: "#4a7fa5",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "10px 22px",
            textDecoration: "none",
          }}
        >
          Take me home
        </Link>
      </main>
  );
}

export default function NotFound() {
  return (
    <>
      <header style={{ background: "#1a2235", position: "sticky", top: 0, zIndex: 50 }}>
        <Nav />
      </header>
      <Suspense fallback={null}>
        <NotFoundContent />
      </Suspense>
      <Footer />
    </>
  );
}
