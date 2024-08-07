import { db } from '@/db/index.ts';
import { userTable } from '@/models/userTable.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string) => {
	const user = await db
		.select()
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1);

	return user[0];
};

export const findUserByUsername = async (username: string) => {
	const user = await db
		.select()
		.from(userTable)
		.where(eq(userTable.username, username))
		.limit(1);

	return user[0];
};

export const findUserById = async (userId: number) => {
	const user = await db
		.select()
		.from(userTable)
		.where(eq(userTable.id, userId))
		.limit(1);

	return user[0];
};

export const validatePassword = async (
	password: string,
	hashedPassword: string,
) => {
	return await bcrypt.compare(password, hashedPassword);
};
