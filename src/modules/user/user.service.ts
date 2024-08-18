import cloudinary from 'cloudinary';
import type { User } from '@/types/globals';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { db } from '@/db';
import { avatarTable } from '@/models/avatarTable';
import { eq } from 'drizzle-orm';

export const uploadImage = async (user: User, file?: Express.Multer.File) => {
	if (!file) throw new BadRequestException('No File Uploaded');

	const version = new Date();
	const avatarId = `${version}/avatar-${user?.id}`;

	await cloudinary.v2.uploader.destroy(avatarId, {
		invalidate: true,
		resource_type: 'image',
	});

	await cloudinary.v2.uploader.upload(file.path, {
		public_id: avatarId,
		folder: 'connectify-avatars',
		resource_type: 'image',
		invalidate: true,
	});

	const hasAvatar = (
		await db
			.select()
			.from(avatarTable)
			.where(eq(avatarTable.user_id, user.id))
	)?.[0];

	if (hasAvatar)
		await db.update(avatarTable).set({
			avatar: avatarId,
			user_id: user?.id,
		});
	else
		await db.insert(avatarTable).values({
			avatar: avatarId,
			user_id: user?.id,
		});

	return 'Successfully Uploaded Image';
};

export const getProfileImage = async (userId: number) => {
	return await db
		.select()
		.from(avatarTable)
		.where(eq(avatarTable.user_id, userId));
};
