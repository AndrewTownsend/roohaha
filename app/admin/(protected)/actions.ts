"use server";

import { adminEnv } from "@/app/lib/admin-env";
import { type FeatureGates } from "@/app/lib/feature-gates";
import { type AdminProject } from "@/app/lib/projects-admin";
import { auth } from "@/auth";
import logger from "@/logger";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { Book, Game } from "@/app/types";

const BookSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(120),
});

const GameSchema = z.object({
  title: z.string().min(1).max(200),
});

const ProjectLinkSchema = z.object({
  kind: z.enum(["github", "ios", "android", "web", "page"]),
  label: z.string().min(1).max(60),
  href: z.string().min(1).max(500),
  primary: z.boolean().optional(),
});

const ProjectSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, digits, and hyphens only"),
  visible: z.boolean(),
  title: z.string().min(1).max(120),
  tagline: z.string().min(1).max(160),
  desc: z.string().min(1).max(600),
  status: z.enum(["building", "shipped", "paused", "planned"]),
  statusLabel: z.string().min(1).max(40),
  meta: z.string().max(60),
  links: z.array(ProjectLinkSchema).max(8),
});

const ProjectsPayloadSchema = z
  .array(ProjectSchema)
  .max(30)
  .refine(
    (arr) => new Set(arr.map((p) => p.id)).size === arr.length,
    { message: "Duplicate project ids" },
  );

export type SaveReadingResult =
  | { ok: true; value: Book[] }
  | { ok: false; error: string };

export type SavePlayingResult =
  | { ok: true; value: Game[] }
  | { ok: false; error: string };

export type SaveProjectsResult =
  | { ok: true; value: AdminProject[] }
  | { ok: false; error: string };

type AdminGuard =
  | { ok: false; error: string }
  | { ok: true; email: string | null | undefined };

async function requireAdmin(): Promise<AdminGuard> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  if (!adminEnv.EDGE_CONFIG || !adminEnv.VERCEL_API_TOKEN) {
    return { ok: false, error: "Admin is not configured in this environment" };
  }
  return { ok: true, email: session.user.email };
}

async function patchEdgeConfig(
  items: Array<{ operation: string; key: string; value: unknown }>,
): Promise<Response> {
  const edgeConfigId = new URL(adminEnv.EDGE_CONFIG).pathname.slice(1);
  const teamParam = process.env.VERCEL_TEAM_ID
    ? `?teamId=${process.env.VERCEL_TEAM_ID}`
    : "";
  return fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamParam}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminEnv.VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    },
  );
}

export async function saveReading(
  _prevState: SaveReadingResult | null,
  formData: FormData,
): Promise<SaveReadingResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;

  let raw: unknown;
  try {
    raw = JSON.parse(formData.get("payload") as string);
  } catch {
    return { ok: false, error: "Invalid payload" };
  }

  const parsed = z.array(BookSchema).max(20).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: JSON.stringify(parsed.error.flatten().fieldErrors) };
  }

  const books = parsed.data;
  if (JSON.stringify(books).length > 6000) {
    return { ok: false, error: "Payload too large (limit ~6 KB)" };
  }

  const res = await patchEdgeConfig([
    { operation: "upsert", key: "reading", value: books },
  ]);

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    logger.error({ status: res.status, text }, "[admin] Edge Config write failed");
    return { ok: false, error: `Edge Config write failed: ${res.status}` };
  }

  logger.info({ email: guard.email }, "[admin] reading saved");
  revalidateTag("content", "max");
  revalidatePath("/");

  return { ok: true, value: books };
}

export async function savePlaying(
  _prevState: SavePlayingResult | null,
  formData: FormData,
): Promise<SavePlayingResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;

  let raw: unknown;
  try {
    raw = JSON.parse(formData.get("payload") as string);
  } catch {
    return { ok: false, error: "Invalid payload" };
  }

  const parsed = z.array(GameSchema).max(20).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: JSON.stringify(parsed.error.flatten().fieldErrors) };
  }

  const games = parsed.data;
  if (JSON.stringify(games).length > 6000) {
    return { ok: false, error: "Payload too large (limit ~6 KB)" };
  }

  const res = await patchEdgeConfig([
    { operation: "upsert", key: "playing", value: games },
  ]);

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    logger.error({ status: res.status, text }, "[admin] Edge Config write failed");
    return { ok: false, error: `Edge Config write failed: ${res.status}` };
  }

  logger.info({ email: guard.email }, "[admin] playing saved");
  revalidateTag("content", "max");
  revalidatePath("/");

  return { ok: true, value: games };
}

export async function saveProjects(
  _prevState: SaveProjectsResult | null,
  formData: FormData,
): Promise<SaveProjectsResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;

  let raw: unknown;
  try {
    raw = JSON.parse(formData.get("payload") as string);
  } catch {
    return { ok: false, error: "Invalid payload" };
  }

  const parsed = ProjectsPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    const msgs = parsed.error.flatten();
    return { ok: false, error: JSON.stringify(msgs) };
  }

  const projects = parsed.data as AdminProject[];
  if (JSON.stringify(projects).length > 6000) {
    return { ok: false, error: "Payload too large (limit ~6 KB)" };
  }

  const res = await patchEdgeConfig([
    { operation: "upsert", key: "projects", value: projects },
  ]);

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    logger.error({ status: res.status, text }, "[admin] Edge Config write failed");
    return { ok: false, error: `Edge Config write failed: ${res.status}` };
  }

  logger.info({ email: guard.email }, "[admin] projects saved");
  revalidatePath("/");

  return { ok: true, value: projects };
}

const FeatureGatesSchema = z.object({
  githubGraph: z.boolean(),
  writing: z.boolean(),
  projects: z.boolean(),
});

export type SaveFlagsResult =
  | { ok: true; value: FeatureGates }
  | { ok: false; error: string };

export async function saveFeatureGates(
  _prevState: SaveFlagsResult | null,
  formData: FormData,
): Promise<SaveFlagsResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;

  const parsed = FeatureGatesSchema.safeParse({
    githubGraph: formData.get("githubGraph") === "on",
    writing: formData.get("writing") === "on",
    projects: formData.get("projects") === "on",
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid flag values" };
  }

  const gates = parsed.data;
  const res = await patchEdgeConfig([
    { operation: "upsert", key: "featureGates", value: gates },
  ]);

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    logger.error({ status: res.status, text }, "[admin] Feature gates write failed");
    return { ok: false, error: `Edge Config write failed: ${res.status}` };
  }

  logger.info({ email: guard.email, gates }, "[admin] feature gates saved");
  revalidateTag("flags", "max");
  revalidatePath("/");

  return { ok: true, value: gates };
}
