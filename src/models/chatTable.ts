import {
	boolean,
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
	text,
	unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './usersTable';

export const chatsTable = pgTable('chats', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }),
	image: text('avatar'),
	is_group: boolean('is_group').default(false),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});

export const chatMembersTable = pgTable('chat_members', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id')
		.references(() => usersTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	chat_id: integer('chat_id')
		.references(() => chatsTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	joined_at: timestamp('joined_at').defaultNow(),
});

export const chatMessagesTable = pgTable('chat_messages', {
	id: serial('id').primaryKey(),
	chat_id: integer('chat_id').references(() => chatsTable.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	sender_id: integer('sender_id').references(() => usersTable.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	content: text('content').notNull(),
	is_edited: boolean('is_edited').default(false),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});

export const chatMessageReadsTable = pgTable(
	'chat_messages_read',
	{
		id: serial('id').primaryKey(),
		chat_id: integer('chat_id')
			.references(() => chatsTable.id, {
				onUpdate: 'cascade',
				onDelete: 'cascade',
			})
			.notNull(),
		message_id: integer('message_id')
			.references(() => chatMessagesTable.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		user_id: integer('user_id')
			.references(() => usersTable.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		read_at: timestamp('read_at').notNull().defaultNow(),
	},
	t => ({
		readUnq: unique('readUnq').on(t.chat_id, t.user_id),
	}),
);
