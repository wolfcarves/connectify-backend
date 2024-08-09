import { pgTable, text, serial, pgEnum } from 'drizzle-orm/pg-core';

const userRoleEnum = pgEnum('role', ['admin', 'user']);

export const userTable = pgTable('user', {
	id: serial('id').notNull().primaryKey(),
	role: userRoleEnum('role').notNull(),
	email: text('email').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
});
