import {
	integer,
	pgTable,
	serial,
	text,
	pgEnum,
	timestamp,
	uuid,
	index,
} from 'drizzle-orm/pg-core';
import { userTable } from './userTable';

export const audienceEnum = pgEnum('audience', ['public', 'private']);

export const postTable = pgTable(
	'post',
	{
		id: serial('id').notNull().primaryKey(),
		uuid: uuid('uuid').defaultRandom(),
		user_id: integer('user_id')
			.references(() => userTable.id)
			.notNull(),
		content: text('content').notNull(),
		audience: audienceEnum('audience').default('public'),
		created_at: timestamp('created_at').defaultNow(),
		updated_at: timestamp('updated_at').defaultNow(),
	},
	table => ({
		uuidIdx: index('uuid').on(table.uuid),
	}),
);

export const postLikeTable = pgTable('post_likes', {
	id: serial('id').notNull().primaryKey(),
	user_id: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	post_id: integer('post_id')
		.notNull()
		.references(() => postTable.id),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').$onUpdate(() => new Date()),
});

export const postCommentTable = pgTable('post_comments', {
	id: serial('id').primaryKey().notNull(),
	user_id: integer('user_id').references(() => userTable.id),
	post_id: integer('post_id').references(() => postTable.id),
	comment: text('comment').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').defaultNow().notNull(),
});
