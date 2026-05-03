import { z } from "zod";
import { validateEnv } from "./validate-env";

const schema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_FROM_EMAIL: z.email("CONTACT_FROM_EMAIL must be a valid email address"),
  CONTACT_TO_EMAIL: z.email("CONTACT_TO_EMAIL must be a valid email address"),
});

export const env = validateEnv(schema, "environment variables");

export type envType = z.infer<typeof schema>;
