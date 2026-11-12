import * as z from "zod";

// The only two roles in the app — chosen to match better-auth's admin
// plugin defaults, so no extra role config is needed.
export const ROLES = ["admin", "user"] as const;
export type Role = (typeof ROLES)[number];
export const RoleSchema = z.enum(ROLES);
