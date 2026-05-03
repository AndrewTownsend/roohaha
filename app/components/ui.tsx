import React from "react";

type CardVariant = "default" | "contact" | "writing";

const borderByVariant: Record<CardVariant, string> = {
  default: "1.5px solid #dde2ea",
  contact: "1.5px solid #4a7fa5",
  writing: "1.5px dashed #dde2ea",
};

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  id?: string;
}

export function Card({ children, variant = "default", id }: CardProps) {
  return (
    <div
      id={id}
      style={{
        background: "#ffffff",
        border: borderByVariant[variant],
        borderRadius: 8,
        padding: "24px 28px",
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="section-label">{children}</h2>;
}

export function AccentBar() {
  return <div className="accent-bar" />;
}
