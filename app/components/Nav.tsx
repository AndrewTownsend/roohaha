"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoSvg } from "./icons";

const BASE_NAV_LINKS = ["About", "Skills", "Highlights", "Contact"] as const;
type BaseNavLink = (typeof BASE_NAV_LINKS)[number];
type NavLink = BaseNavLink | "Projects";

function buildNavLinks(showProjects: boolean): NavLink[] {
  if (!showProjects) return [...BASE_NAV_LINKS];
  return ["About", "Skills", "Projects", "Highlights", "Contact"];
}

interface NavProps {
  showProjects?: boolean;
}

function triggerSectionHighlight(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const fire = () => {
    el.classList.remove("section-highlight");
    void el.offsetWidth;
    el.classList.add("section-highlight");
    el.addEventListener("animationend", () => el.classList.remove("section-highlight"), { once: true });
  };

  const rect = el.getBoundingClientRect();
  const alreadyVisible = rect.top >= 0 && rect.top <= window.innerHeight * 0.85;

  if (alreadyVisible) {
    fire();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          fire();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    setTimeout(() => observer.disconnect(), 2500);
  }
}

export default function Nav({ showProjects = false }: NavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = buildNavLinks(showProjects);

  return (
    <nav style={{ borderBottom: "1px solid #243048", maxWidth: 1140, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 36px" }}>
        <Link
          href="/"
          aria-label="Go to home"
          style={{ display: "flex" }}
          onClick={() => {
            if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
            setOpen(false);
          }}
        >
          <LogoSvg />
        </Link>

        <div className="nav-desktop-links">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="nav-link"
              onClick={() => triggerSectionHighlight(link.toLowerCase())}
            >
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
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => { setOpen(false); triggerSectionHighlight(link.toLowerCase()); }}
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
