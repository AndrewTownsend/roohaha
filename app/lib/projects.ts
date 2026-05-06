import { createClient } from "@vercel/edge-config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Project } from "@/app/types";

interface ProjectEntry extends Project {
  visible: boolean;
}

export async function readProjects(): Promise<Project[]> {
  if (!process.env.EDGE_CONFIG) {
    const raw = readFileSync(join(process.cwd(), "content/projects.json"), "utf-8");
    const entries = JSON.parse(raw) as ProjectEntry[];
    return entries.filter((p) => p.visible);
  }
  const client = createClient(process.env.EDGE_CONFIG);
  const entries = await client.get<ProjectEntry[]>("projects");
  return (entries ?? []).filter((p) => p.visible);
}
