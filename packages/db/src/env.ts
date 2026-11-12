import { existsSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

// DB_FILE_NAME must be absolute so every process (Next dev/build, drizzle-kit,
// seed, containers) opens the same file regardless of cwd. Relative values are
// rejected instead of anchored to some directory — that anchoring differs per
// environment and hides misconfiguration.
const dbFileSchema = z
  .string({ error: "DB_FILE_NAME is required — set it in apps/web/.env" })
  .min(1, "DB_FILE_NAME must not be empty")
  .refine(
    path.isAbsolute,
    "DB_FILE_NAME must be an absolute path (see README → Environment)",
  );

const parsed = dbFileSchema.safeParse(process.env.DB_FILE_NAME);
if (!parsed.success) {
  throw new Error(`Invalid DB_FILE_NAME: ${parsed.error.issues[0]?.message}`);
}

export const env = { DB_FILE_NAME: parsed.data };

// No auto-create on purpose: a typo'd path must fail loudly here
const dir = path.dirname(env.DB_FILE_NAME);
if (!existsSync(dir)) {
  throw new Error(
    `DB_FILE_NAME directory does not exist: ${dir} — fix the path in apps/web/.env or create the directory`,
  );
}
