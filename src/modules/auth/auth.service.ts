import { db } from '@/db/index';
import { userTable } from '@/models/userTable';
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

export const createUser = async (
	name: string,
	username: string,
	email: string,
	password: string,
) => {
	return await db.insert(userTable).values({
		name,
		username: username.toLowerCase(),
		email: email.toLowerCase(),
		password,
	});
};

export const validatePassword = async (
	password: string,
	hashedPassword: string,
) => {
	return await bcrypt.compare(password, hashedPassword);
};
