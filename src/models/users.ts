import { pgTable, bigserial, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'bigint' }),
  email: varchar('email', { length: 255 }),
  username: varchar('username', { length: 255 }),
  password: varchar('password', { length: 255 }),
});
