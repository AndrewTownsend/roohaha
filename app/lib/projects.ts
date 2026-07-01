import { createClient } from "@vercel/edge-config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Project } from "@/app/types";

interface ProjectEntry extends Project {
  visible: boolean;
}

async function fetchProjects(): Promise<ProjectEntry[]> {
  if (!process.env.EDGE_CONFIG) {
    const raw = readFileSync(join(process.cwd(), "content/projects.json"), "utf-8");
    return JSON.parse(raw) as ProjectEntry[];
  }
  const client = createClient(process.env.EDGE_CONFIG);
  const entries = await client.get<ProjectEntry[]>("projects");
  return entries ?? [];
}

export async function readProjects(): Promise<Project[]> {
  const entries = await fetchProjects();
  return entries.filter((p) => p.visible);
}

export async function readAllProjects(): Promise<Project[]> {
  return fetchProjects();
}
