import {
	integer,
	pgTable,
	serial,
	text,
	pgEnum,
	timestamp,
	uuid,
	index,
	foreignKey,
} from 'drizzle-orm/pg-core';
import { usersTable } from './usersTable';

export const audienceEnum = pgEnum('audience', [
	'public',
	'friends',
	'private',
]);

export const postTable = pgTable(
	'post',
	{
		id: serial('id').notNull().primaryKey(),
		uuid: uuid('uuid').defaultRandom().notNull(),
		user_id: integer('user_id')
			.references(() => usersTable.id)
			.notNull(),
		content: text('content'),
		audience: audienceEnum('audience').default('public'),
		created_at: timestamp('created_at').defaultNow(),
		updated_at: timestamp('updated_at').defaultNow(),
	},
	table => ({
		uuidIdx: index('uuid').on(table.uuid),
	}),
);

export const postImagesTable = pgTable(
	'post_images',
	{
		id: serial('id').notNull().primaryKey(),
		post_id: integer('post_id')
			.references(() => postTable.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		image: text('image').notNull(),
		mime_type: text('mime_type').notNull(),
		created_at: timestamp('created_at').defaultNow(),
		updated_at: timestamp('updated_at').defaultNow(),
	},
	table => ({
		postId: index('post_id').on(table.post_id),
	}),
);

export const postLikeTable = pgTable('post_likes', {
	id: serial('id').notNull().primaryKey(),
	user_id: integer('user_id')
		.notNull()
		.references(() => usersTable.id),
	post_id: integer('post_id')
		.notNull()
		.references(() => postTable.id, {
			onDelete: 'cascade',
		}),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').$onUpdate(() => new Date()),
});

export const postCommentTable = pgTable(
	'post_comments',
	{
		id: serial('id').primaryKey(),
		user_id: integer('user_id').references(() => usersTable.id),
		post_id: integer('post_id').references(() => postTable.id, {
			onDelete: 'cascade',
		}),
		comment_id: integer('comment_id'),
		comment: text('comment').notNull(),
		created_at: timestamp('created_at').defaultNow(),
		updated_at: timestamp('updated_at').defaultNow(),
	},
	table => ({
		parentReference: foreignKey({
			columns: [table.comment_id],
			foreignColumns: [table.id],
			name: 'post_comment_id_fkey',
		}),
	}),
);

export const postReplyTable = pgTable('post_reply', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id')
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	comment_id: integer('comment_id')
		.references(() => postCommentTable.id, { onDelete: 'cascade' })
		.notNull(),
	reply: text('reply').notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});

export const postShareTable = pgTable('post_shares', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id')
		.references(() => usersTable.id)
		.notNull(),
	post_id: integer('post_id')
		.references(() => postTable.id)
		.notNull(),
	comment: text('comment'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});
