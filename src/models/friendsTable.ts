import { boolean, integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { usersTable } from './usersTable';

export const friendsTable = pgTable('friends', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id')
		.notNull()
		.references(() => usersTable.id),
	friend_id: integer('friend_id')
		.notNull()
		.references(() => usersTable.id),

	is_accepted: boolean('is_accepted').default(false),
});
