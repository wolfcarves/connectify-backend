import { integer, pgTable, serial } from 'drizzle-orm/pg-core';

export const friends = pgTable('friends', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id'),
	friend_id: integer('friend_id'),
});
