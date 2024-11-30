import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { postTable } from './postTable';
import { usersTable } from './usersTable';

export const bookmarkTable = pgTable('bookmark', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id').references(() => usersTable.id),
	post_id: integer('post_id').references(() => postTable.id, {
		onDelete: 'cascade',
	}),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});
