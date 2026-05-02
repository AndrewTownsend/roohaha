"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a2235",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <svg width="148" height="26" viewBox="0 0 148 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="13" r="10" stroke="#4a7fa5" strokeWidth="1.8" fill="none" />
          <text x="11" y="17.5" textAnchor="middle" fontFamily="Syne, sans-serif" fontSize="9.5" fontWeight="700" fill="#4a7fa5" letterSpacing="-0.3">rh</text>
          <circle cx="20" cy="13" r="10" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" fill="none" />
          <text x="20" y="17.5" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="10" fontWeight="400" fill="rgba(255,255,255,0.22)">&gt;</text>
          <text fontFamily="Syne, sans-serif" fontWeight="600" fontSize="17" fill="#4a7fa5"><tspan x="36" y="18">/</tspan></text>
          <text fontFamily="Syne, sans-serif" fontWeight="700" fontSize="17" letterSpacing="-0.4">
            <tspan x="48" y="18" fill="#e8f0f8">roo</tspan>
            <tspan fill="#4a7fa5">ha</tspan>
            <tspan fontSize="14" fontWeight="600" fill="#4a7fa5" opacity="0.5">ha</tspan>
          </text>
        </svg>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#f0f4f8",
          marginBottom: 12,
          letterSpacing: "-0.02em",
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "0.9rem",
          color: "#5a7088",
          maxWidth: 360,
          lineHeight: 1.6,
          marginBottom: 28,
        }}
      >
        The server isn&apos;t configured correctly. If you&apos;re the site owner, check that all
        required environment variables are set.
      </p>
      <button
        onClick={reset}
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: 14,
          fontWeight: 600,
          background: "#4a7fa5",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
