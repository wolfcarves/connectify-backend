import {
	pgTable,
	text,
	serial,
	timestamp,
	boolean,
	integer,
} from 'drizzle-orm/pg-core';
import { postTable } from './postTable';

export const usersTable = pgTable('user', {
	id: serial('id').notNull().primaryKey(),
	avatar: text('avatar').notNull(),
	email: text('email').notNull(),
	name: text('name').notNull(),
	username: text('username').unique().notNull(),
	password: text('password').notNull(),
	city: text('city'),
	is_bot: boolean('is_bot').default(false),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});

export const usersBookmarkTable = pgTable('user_bookmark', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id').references(() => usersTable.id),
	post_id: integer('post_id').references(() => postTable.id),
});
