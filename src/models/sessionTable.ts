import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { usersTable } from './usersTable';

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});
