import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { join } from 'node:path';
import * as schema from './schema';

const sqlite = new Database(join(__dirname, './assets/app.db'));

export const db = drizzle(sqlite, { schema });
