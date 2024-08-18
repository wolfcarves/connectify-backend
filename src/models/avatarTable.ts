import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { userTable } from './userTable';

export const avatarTable = pgTable('avatar', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id').references(() => userTable.id),
	avatar: text('avatar').default('').notNull(),
});
