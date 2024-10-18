import { relations } from 'drizzle-orm';
import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';
import { friends } from './friendTable';

export const usersTable = pgTable('user', {
	id: serial('id').notNull().primaryKey(),
	avatar: text('avatar').notNull(),
	email: text('email').notNull(),
	name: text('name').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
	usersToFriends: many(friends),
}));
