import { pgTable, text, serial } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
	id: serial('id').notNull().primaryKey(),
	email: text('email').notNull(),
	name: text('name').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
});
