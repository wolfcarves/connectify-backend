import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { userTable } from './userTable';

export const friendsSuggestionsTable = pgTable('friends_suggestions', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => userTable.id),
});
