import 'dotenv/config';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Pool } from 'pg';

const client = postgres(process.env.DATABASE_URI as string);
export const db = drizzle(client);
