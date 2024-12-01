import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { postTable } from '@/models/postTable';
import { bookmarkTable } from '@/models/bookmarkTable';
import cloudinary from 'cloudinary';

export const checkPostExistence = async (postId: number) => {
	const exists = !!(
		await db
			.select()
			.from(postTable)
			.where(and(eq(postTable.id, postId)))
	)[0];

	return exists;
};

export const isPostSaved = async (userId: number, postId: number) => {
	const isSaved = !!(
		await db
			.select()
			.from(bookmarkTable)
			.where(
				and(
					eq(bookmarkTable.user_id, userId),
					eq(bookmarkTable.post_id, postId),
				),
			)
	)[0];

	return isSaved;
};

export const deleteAllUploadedImages = async (postUUID?: string) => {
	if (postUUID) {
		await cloudinary.v2.api
			.delete_resources_by_prefix(`posts/${postUUID}/`)
			.catch(err => {
				// console.log('post', { ...err })
			});

		await cloudinary.v2.api
			.delete_folder(`posts/${postUUID}/`)
			.catch(err => {
				// console.log('post', { ...err })
			});
	}
};
