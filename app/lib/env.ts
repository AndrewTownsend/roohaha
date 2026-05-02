import { z } from "zod";

const schema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_FROM_EMAIL: z.email("CONTACT_FROM_EMAIL must be a valid email address"),
  CONTACT_TO_EMAIL: z.email("CONTACT_TO_EMAIL must be a valid email address"),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  const fields = result.error.flatten().fieldErrors;
  const lines = Object.entries(fields)
    .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
    .join("\n");
  throw new Error(`Missing or invalid environment variables:\n${lines}`);
}

export const env = result.data;

export type envType = z.infer<typeof schema>;
