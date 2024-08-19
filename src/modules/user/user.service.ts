import cloudinary from 'cloudinary';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { env } from '@/config/env';
import { userTable } from '@/models/userTable';
import crypto from 'crypto';
import { avatarTable } from '@/models/avatarTable';

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

export const uploadImage = async (
	userId: number,
	file?: Express.Multer.File,
) => {
	if (!file) throw new BadRequestException('No File Uploaded');

	const version = crypto.randomUUID();
	const avatarId = `version-${version}-avatar-${userId}`;

	const user = (
		await db.select().from(userTable).where(eq(userTable.id, userId))
	)[0];

	await cloudinary.v2.uploader.destroy(
		env?.cloudinaryProfilePublicID + '/' + user.avatar,
		{ invalidate: true },
	);

	await cloudinary.v2.uploader.upload(file.path, {
		public_id: avatarId,
		folder: env?.cloudinaryProfilePublicID,
		resource_type: 'image',
	});

	await db
		.update(userTable)
		.set({
			avatar: avatarId,
		})
		.where(eq(userTable.id, userId));

	return 'Successfully Uploaded Image';
};

export const getProfileImage = async (userId: number) => {
	return await db.select().from(userTable).where(eq(userTable.id, userId));
};

export const deleteUserProfileImage = async (userId: number) => {
	const user = (
		await db.select().from(userTable).where(eq(userTable.id, userId))
	)[0];

	await cloudinary.v2.uploader.destroy(
		env?.cloudinaryProfilePublicID + '/' + user.avatar,
		{
			invalidate: true,
		},
	);

	const avatar = (await db.select().from(avatarTable))[0];

	await db
		.update(userTable)
		.set({
			avatar: avatar?.avatar,
		})
		.where(eq(userTable.id, userId));
};
