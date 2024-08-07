import { pgTable, text, timestamp, serial, integer } from 'drizzle-orm/pg-core';
import { userTable } from './userTable.ts';

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});
