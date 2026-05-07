import { createClient } from "@vercel/edge-config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Project } from "@/app/types";

export interface AdminProject extends Project {
  visible: boolean;
}

export async function readProjectsForAdmin(): Promise<AdminProject[]> {
  if (!process.env.EDGE_CONFIG) {
    const raw = readFileSync(join(process.cwd(), "content/projects.json"), "utf-8");
    return JSON.parse(raw) as AdminProject[];
  }
  const client = createClient(process.env.EDGE_CONFIG);
  const entries = await client.get<AdminProject[]>("projects");
  return entries ?? [];
}
