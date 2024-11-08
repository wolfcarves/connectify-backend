import 'dotenv/config';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@/config/env';

const globalDb = globalThis as unknown as {
	conn: postgres.Sql | undefined;
};

const conn = globalDb?.conn ?? postgres(env?.databaseUri as string);

if (process.env.NODE_ENV !== 'production') {
	globalDb.conn = conn;
}

export const db = drizzle(conn);
