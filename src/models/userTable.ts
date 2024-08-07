import { pgTable, text, serial } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
	id: serial('id').notNull().primaryKey(),
	email: text('email'),
	username: text('username'),
	password: text('password'),
});
