"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminLink() {
  const { status } = useSession();
  if (status !== "authenticated") return null;
  return (
    <Link
      href="/admin"
      style={{
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 11,
        color: "#7a90a8",
        textDecoration: "none",
      }}
    >
      admin
    </Link>
  );
}
