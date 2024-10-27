import {
	integer,
	pgEnum,
	pgTable,
	serial,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import { usersTable } from './usersTable';

export const friendshipsTable = pgTable(
	'friendships',
	{
		id: serial('id').primaryKey(),
		user_id: integer('user_id')
			.notNull()
			.references(() => usersTable.id),
		friend_id: integer('friend_id')
			.notNull()
			.references(() => usersTable.id),
		created_at: timestamp('created_at').defaultNow(),
		updated_at: timestamp('updated_at').defaultNow(),
	},
	t => ({
		userIdFriendIdUniqueIdx: uniqueIndex().on(t.user_id, t.friend_id),
	}),
);

export const statusEnum = pgEnum('status', ['accepted', 'pending']);

export const friendRequestsTable = pgTable(
	'friend_request',
	{
		id: serial('id').primaryKey(),
		sender_id: integer('sender_id')
			.notNull()
			.references(() => usersTable.id),
		receiver_id: integer('receiver_id')
			.notNull()
			.references(() => usersTable.id),
		status: statusEnum('status').default('pending'),
		created_at: timestamp('created_at').defaultNow(),
		updated_at: timestamp('updated_at').defaultNow(),
	},
	t => ({
		senderIdReceiverIdUniqueIdx: uniqueIndex().on(
			t.sender_id,
			t.receiver_id,
		),
	}),
);
