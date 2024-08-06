import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  verbose: true,
  out: './migrations',
  schema: './src/models/*',
  dialect: 'postgresql',
  dbCredentials: {
    database: process.env.DATABASE as string,
    host: process.env.DATABASE_HOST as string,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    port: Number(process.env.DATABASE_PORT),
  },
});
