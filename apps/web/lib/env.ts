import { z } from "zod";

// Validate server env at boot — anything consumed in this app goes through
// this object, never raw process.env.
const envSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string({
      error: "BETTER_AUTH_SECRET is required — set it in apps/web/.env",
    })
    .min(1, "BETTER_AUTH_SECRET must not be empty"),
  BETTER_AUTH_URL: z.url(
    "BETTER_AUTH_URL must be a valid URL (e.g. http://localhost:3000)",
  ),
});

const parsed = envSchema.safeParse({
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
});

if (!parsed.success) {
  const issue = parsed.error.issues[0]?.message ?? "invalid environment";
  throw new Error(`Invalid environment: ${issue}`);
}

export const env = parsed.data;
