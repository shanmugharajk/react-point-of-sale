import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

// Relative DB_FILE_NAME values resolve against each process's cwd — scripts,
// drizzle-kit and the dev server sit in different folders. Walk UP to the
// workspace root (never import.meta.* — undefined in code that reaches the
// Next build) so every process sees one database file.
function workspaceRoot(): string {
  let dir = process.cwd();
  while (!existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error("pnpm-workspace.yaml not found above cwd");
    }
    dir = parent;
  }
  return dir;
}

const root = workspaceRoot();
const raw = process.env.DB_FILE_NAME ?? "local.db";

export const dbFilePath = path.isAbsolute(raw) ? raw : path.join(root, raw);

mkdirSync(path.dirname(dbFilePath), { recursive: true });
