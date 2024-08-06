import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  email: text('email').notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),
});
