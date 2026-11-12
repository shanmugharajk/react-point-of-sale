// Package surface for the app: import { db, schema } from "@point-of-sale/db".
// Files inside this package import the concrete module directly (./db, ./env)
// — one-dot only; "../" imports are banned by the biome import law.
export { db } from "./db";
export * as schema from "./schema";
