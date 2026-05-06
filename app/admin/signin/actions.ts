"use server";

import { headers, cookies } from "next/headers";
import { signIn } from "@/auth";

export async function signInWithGitHub() {
  const h  = await headers();
  const cs = await cookies();
  const ip =
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  cs.set("adminLastLogin", `${Date.now()}|${ip}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  await signIn("github", { redirectTo: "/admin" });
}
