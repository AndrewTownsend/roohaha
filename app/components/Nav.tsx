"use client";

import { useState } from "react";
import { LogoSvg } from "./icons";

const NAV_LINKS = ["About", "Skills", "Highlights", "Contact"] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ borderBottom: "1px solid #243048", maxWidth: 1140, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 36px" }}>
        <a href="#" aria-label="roohaha home">
          <LogoSvg />
        </a>

        <div className="nav-desktop-links">
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">
              {link}
            </a>
          ))}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setOpen((o) => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, alignItems: "center" }}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="2" y1="2" x2="16" y2="16" stroke="#8da0b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="2" x2="2" y2="16" stroke="#8da0b8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <line x1="0" y1="1" x2="18" y2="1" stroke="#8da0b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1="7" x2="18" y2="7" stroke="#8da0b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1="13" x2="18" y2="13" stroke="#8da0b8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="nav-mobile-menu" style={{ borderTop: "1px solid #243048", padding: "6px 0 12px" }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="nav-link"
              style={{ display: "block", padding: "10px 20px" }}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
