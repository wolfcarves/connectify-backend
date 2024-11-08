import { pgTable, text, serial, timestamp, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('user', {
	id: serial('id').notNull().primaryKey(),
	avatar: text('avatar').notNull(),
	email: text('email').notNull(),
	name: text('name').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	city: text('city'),
	is_bot: boolean('is_bot').default(false),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});
