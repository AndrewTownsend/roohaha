import type { z } from "zod";

export function validateEnv<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  label: string,
): z.infer<z.ZodObject<T>> {
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const fields = result.error.flatten().fieldErrors;
    const lines = Object.entries(fields)
      .map(([key, msgs]) => `  ${key}: ${(msgs as string[])?.join(", ")}`)
      .join("\n");
    throw new Error(`Missing or invalid ${label}:\n${lines}`);
  }
  return result.data;
}
