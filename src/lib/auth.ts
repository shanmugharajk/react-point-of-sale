import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db } from '~/db'
import * as schema from '~/db/auth-schema'

import { Role } from './roles'

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite', schema }),
  // Only admins create accounts; there is no public sign-up.
  emailAndPassword: { enabled: true, disableSignUp: true },
  plugins: [
    admin({ adminRoles: [Role.Admin], defaultRole: Role.Employee }),
    tanstackStartCookies(), // must stay last
  ],
})
