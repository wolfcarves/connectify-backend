import 'dotenv/config';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const globalDb = globalThis as unknown as {
	conn: postgres.Sql | undefined;
};

const database_uri =
	process.env.NODE_ENV === 'development'
		? 'postgres://postgres:awdawd123@103.3.60.156:5432/connectify_db'
		: process.env.DATABASE_URI;

const conn = globalDb?.conn ?? postgres(database_uri as string);

if (process.env.NODE_ENV !== 'production') {
	globalDb.conn = conn;
}

export const db = drizzle(conn);
