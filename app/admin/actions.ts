"use server";

import { adminEnv } from "@/app/lib/admin-env";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const Book = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(120),
});

const Game = z.object({
  title: z.string().min(1).max(200),
});

const Payload = z.object({
  reading: z.array(Book).max(20),
  playing: z.array(Game).max(20),
});

type BookType = z.infer<typeof Book>;
type GameType = z.infer<typeof Game>;

export type SaveResult =
  | { ok: true; value: { reading: BookType[]; playing: GameType[] } }
  | { ok: false; error: string };

export async function saveContent(
  _prevState: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  if (!adminEnv.EDGE_CONFIG || !adminEnv.VERCEL_API_TOKEN) {
    return { ok: false, error: "Admin is not configured in this environment" };
  }

  let reading: unknown;
  let playing: unknown;
  try {
    reading = JSON.parse(formData.get("reading") as string);
    playing = JSON.parse(formData.get("playing") as string);
  } catch {
    return { ok: false, error: "Invalid JSON in one or both fields" };
  }

  const parsed = Payload.safeParse({ reading, playing });
  if (!parsed.success) {
    const msgs = parsed.error.flatten();
    return { ok: false, error: JSON.stringify(msgs.fieldErrors) };
  }

  const { reading: books, playing: games } = parsed.data;
  const body = JSON.stringify({ reading: books, playing: games });
  if (body.length > 6000) {
    return {
      ok: false,
      error: "Payload too large (limit ~6 KB to stay under Edge Config cap)",
    };
  }

  const edgeConfigId = new URL(adminEnv.EDGE_CONFIG).pathname.slice(1);
  const teamParam = process.env.VERCEL_TEAM_ID
    ? `?teamId=${process.env.VERCEL_TEAM_ID}`
    : "";

  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamParam}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminEnv.VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          { operation: "upsert", key: "reading", value: books },
          { operation: "upsert", key: "playing", value: games },
        ],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error("[admin] Edge Config write failed:", res.status, text);
    return { ok: false, error: `Edge Config write failed: ${res.status}` };
  }

  console.log(
    `[admin] content saved by ${session.user.email} at ${new Date().toISOString()}`,
  );

  revalidateTag("content", "max");
  revalidatePath("/");

  return { ok: true, value: { reading: books, playing: games } };
}
