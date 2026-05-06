import { createClient } from "@vercel/edge-config";

export interface FeatureGates {
  githubGraph: boolean;
  writing: boolean;
  projects: boolean;
}

export const DEFAULT_GATES: FeatureGates = {
  githubGraph: true,
  writing: true,
  projects: true,
};

export async function readFeatureGates(): Promise<FeatureGates> {
  if (!process.env.EDGE_CONFIG) {
    return DEFAULT_GATES;
  }
  const client = createClient(process.env.EDGE_CONFIG);
  const stored = await client.get<Partial<FeatureGates>>("featureGates");
  // When Edge Config is present, absent or unrecognised keys default to false
  // so a missing/deleted key never surfaces intentionally-hidden content.
  return {
    githubGraph: stored?.githubGraph ?? false,
    writing: stored?.writing ?? false,
    projects: stored?.projects ?? false,
  };
}
