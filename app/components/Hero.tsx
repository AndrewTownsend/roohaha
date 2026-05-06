import Image from "next/image";
import { LinkedInIcon, GitHubIcon } from "./icons";

function HeroLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: string;
  icon: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hero-link">
      {icon}
      {children}
    </a>
  );
}

export default function Hero() {
  return (
    <div
      style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", gap: 28, padding: "32px 36px 36px" }}
      className="max-md:flex-col max-md:items-start max-md:gap-4 max-md:px-4 max-md:py-5"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/photo.jpg"
          alt="Andrew V. Townsend"
          width={96}
          height={96}
          className="anim anim-1 max-md:w-[72px] max-md:h-[72px] flex-shrink-0"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center top",
            border: "2px solid #4a7fa5",
            boxShadow: "0 0 0 4px rgba(74,127,165,0.15)",
          }}
          priority
        />
        <div className="md:hidden">
          <h1
            className="anim anim-2"
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "#f0f4f8",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Andrew V. Townsend
          </h1>
          <div className="anim anim-3" style={{ fontSize: "0.75rem", color: "#7a90a8", marginTop: 4 }}>
            Senior Full Stack Engineer
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} className="max-md:w-full">
        <h1
          className="anim anim-2 max-md:hidden"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 700,
            fontSize: "2.2rem",
            color: "#f0f4f8",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Andrew V. Townsend
        </h1>
        <div
          className="anim anim-3 max-md:hidden"
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "1rem",
            color: "#7a90a8",
            margin: "6px 0 10px",
          }}
        >
          Senior Full Stack Engineer
        </div>
        <div
          className="anim anim-3"
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "0.9rem",
            color: "#5a7088",
            lineHeight: 1.5,
            maxWidth: 480,
            marginBottom: 10,
          }}
        >
          From early-stage startups to Fortune 10 enterprises — building systems at every scale
          for nearly two decades.
        </div>
        <div className="anim anim-4" style={{ display: "flex", gap: 16 }}>
          <HeroLink href="https://www.linkedin.com/in/andrew-townsend-6876836/" icon={<LinkedInIcon />}>
            LinkedIn
          </HeroLink>
          <HeroLink href="https://github.com/AndrewTownsend" icon={<GitHubIcon />}>
            GitHub
          </HeroLink>
        </div>
      </div>
    </div>
  );
}
