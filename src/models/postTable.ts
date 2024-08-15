import { integer, pgTable, serial, text, pgEnum } from 'drizzle-orm/pg-core';
import { userTable } from './userTable';

export const audienceEnum = pgEnum('audience', ['public', 'private']);

export const postTable = pgTable('post', {
	id: serial('id').notNull().primaryKey(),
	userId: integer('user_id')
		.references(() => userTable.id)
		.notNull(),
	content: text('content').notNull(),
	audience: audienceEnum('audience').default('public'),
	likes: integer('likes').default(0),
	comments: integer('comments').default(0),
	shares: integer('shares').default(0),
});
