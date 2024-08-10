import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { userTable } from './userTable';

export const postTable = pgTable('post', {
	id: serial('id').notNull().primaryKey(),
	userId: integer('user_id').references(() => userTable.id),
	description: text('description'),
	likes: integer('likes').default(0),
	comments: integer('comments').default(0),
	shares: integer('shares').default(0),
});
