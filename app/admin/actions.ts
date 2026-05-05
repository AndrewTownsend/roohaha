"use server";

import { adminEnv } from "@/app/lib/admin-env";
import { type FeatureGates } from "@/app/lib/feature-gates";
import { auth } from "@/auth";
import logger from "@/logger";
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
    logger.error({ status: res.status, text }, "[admin] Edge Config write failed");
    return { ok: false, error: `Edge Config write failed: ${res.status}` };
  }

  logger.info({ email: session.user.email }, "[admin] content saved");

  revalidateTag("content", "max");
  revalidatePath("/");

  return { ok: true, value: { reading: books, playing: games } };
}

const FeatureGatesSchema = z.object({
  githubGraph: z.boolean(),
  writing: z.boolean(),
});

export type SaveFlagsResult =
  | { ok: true; value: FeatureGates }
  | { ok: false; error: string };

export async function saveFeatureGates(
  _prevState: SaveFlagsResult | null,
  formData: FormData,
): Promise<SaveFlagsResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  if (!adminEnv.EDGE_CONFIG || !adminEnv.VERCEL_API_TOKEN) {
    return { ok: false, error: "Admin is not configured in this environment" };
  }

  const parsed = FeatureGatesSchema.safeParse({
    githubGraph: formData.get("githubGraph") === "on",
    writing: formData.get("writing") === "on",
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid flag values" };
  }

  const gates = parsed.data;
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
        items: [{ operation: "upsert", key: "featureGates", value: gates }],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    logger.error({ status: res.status, text }, "[admin] Feature gates write failed");
    return { ok: false, error: `Edge Config write failed: ${res.status}` };
  }

  logger.info({ email: session.user.email, gates }, "[admin] feature gates saved");

  revalidateTag("flags", "max");
  revalidatePath("/");

  return { ok: true, value: gates };
}
