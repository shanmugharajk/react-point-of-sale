import { defineConfig } from 'drizzle-kit'
import { dbUrl } from '~/db/url'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: { url: dbUrl },
})
