import { db } from '@/db/index';
import { usersTable } from '@/models/usersTable';
import bcrypt from 'bcrypt';
import { avatarTable } from '@/models/avatarTable';

export const createUser = async (
	name: string,
	username: string,
	email: string,
	password: string,
) => {
	const arrName = name.split(' ');

	const capitalizeWord = (word: string) => {
		if (!word) return '';
		return word[0].toUpperCase() + word.slice(1).toLowerCase();
	};

	const fullname = arrName.filter(Boolean).map(capitalizeWord).join(' ');
	const avatar = (await db.select().from(avatarTable))[0];

	const user = (
		await db
			.insert(usersTable)
			.values({
				avatar: avatar?.avatar ?? '/m_avatar_1.svg',
				name: fullname,
				username: username.toLowerCase(),
				email: email.toLowerCase(),
				password,
			})
			.returning({ id: usersTable.id })
	)[0];

	return user;
};

export const validatePassword = async (
	password: string,
	hashedPassword: string,
) => {
	return await bcrypt.compare(password, hashedPassword);
};
