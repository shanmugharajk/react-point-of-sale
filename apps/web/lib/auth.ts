import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, schema } from "@point-of-sale/db";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

import { env } from "./env";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
});
