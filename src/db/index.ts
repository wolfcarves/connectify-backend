import 'dotenv/config';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@/config/env';

const conn = postgres(env?.databaseUri as string);

export const db = drizzle(conn);
