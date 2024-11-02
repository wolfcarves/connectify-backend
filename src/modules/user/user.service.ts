import cloudinary from 'cloudinary';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { db } from '@/db';
import { eq, or, getTableColumns } from 'drizzle-orm';
import { env } from '@/config/env';
import { usersTable } from '@/models/usersTable';
import crypto from 'crypto';
import { avatarTable } from '@/models/avatarTable';

export const getUser = async ({
	userId,
	username,
	email,
}: {
	userId?: number;
	username?: string;
	email?: string;
}) => {
	const user = (
		await db
			.select()
			.from(usersTable)
			.where(
				or(
					eq(usersTable.id, userId ?? -1),
					eq(usersTable.username, username ?? ''),
					eq(usersTable.email, email ?? ''),
				),
			)
			.limit(1)
	)[0];

	return user;
};

export const getAllUsers = async ({
	limit = 100,
	offset = 0,
}: { offset?: number; limit?: number } = {}) => {
	const { password, ...columns } = getTableColumns(usersTable);

	const user = await db
		.select(columns)
		.from(usersTable)
		.offset(offset)
		.limit(limit);

	return user;
};

export const uploadUserProfileImage = async (
	userId: number,
	file?: Express.Multer.File,
) => {
	if (!file) throw new BadRequestException('No File Uploaded');

	const version = crypto.randomUUID();
	const avatarId = `version-${version}-avatar-${userId}`;

	const user = (
		await db.select().from(usersTable).where(eq(usersTable.id, userId))
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
		.update(usersTable)
		.set({
			avatar: avatarId,
		})
		.where(eq(usersTable.id, userId));

	return 'Successfully Uploaded Image';
};

export const deleteUserProfileImage = async (userId: number) => {
	const user = (
		await db.select().from(usersTable).where(eq(usersTable.id, userId))
	)[0];

	await cloudinary.v2.uploader.destroy(
		env?.cloudinaryProfilePublicID + '/' + user.avatar,
		{
			invalidate: true,
		},
	);

	const avatar = (await db.select().from(avatarTable))[0];

	await db
		.update(usersTable)
		.set({
			avatar: avatar?.avatar,
		})
		.where(eq(usersTable.id, userId));
};
