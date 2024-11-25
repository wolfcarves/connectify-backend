import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { postTable } from '@/models/postTable';
import { bookmarkTable } from '@/models/bookmarkTable';

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