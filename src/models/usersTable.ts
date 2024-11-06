import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('user', {
	id: serial('id').notNull().primaryKey(),
	avatar: text('avatar').notNull(),
	email: text('email').notNull(),
	name: text('name').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	city: text('city'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});
