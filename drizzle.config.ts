import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  verbose: true,
  out: './migrations',
  schema: './src/models/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URI as string,
  },
});
