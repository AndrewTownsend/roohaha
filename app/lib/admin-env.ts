import { z } from "zod";
import { validateEnv } from "./validate-env";

const schema = z.object({
  EDGE_CONFIG: z.string().url("EDGE_CONFIG must be a valid URL"),
  VERCEL_API_TOKEN: z.string().min(1, "VERCEL_API_TOKEN is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_GITHUB_ID: z.string().min(1, "AUTH_GITHUB_ID is required"),
  AUTH_GITHUB_SECRET: z.string().min(1, "AUTH_GITHUB_SECRET is required"),
  ADMIN_EMAILS: z.string().min(1, "ADMIN_EMAILS must contain at least one email"),
});

export const adminEnv = process.env.VERCEL_ENV === "production"
  ? validateEnv(schema, "admin environment variables")
  : {
      EDGE_CONFIG: process.env.EDGE_CONFIG ?? "",
      VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN ?? "",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "",
      AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ?? "",
      AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ?? "",
      ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? "",
    };
