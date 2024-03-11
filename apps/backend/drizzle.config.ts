import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: 'apps/backend/src/app/db/schema/index.ts',
  driver: 'better-sqlite',
  out: 'apps/backend/drizzle',
  dbCredentials: {
    url: 'apps/backend/app.db',
  },
  verbose: true,
  strict: true,
});
