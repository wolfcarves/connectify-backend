import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const avatarTable = pgTable('avatar', {
	id: serial('id'),
	avatar: text('avatar').notNull(),
});
