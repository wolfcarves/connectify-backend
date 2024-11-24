import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { postTable } from '@/models/postTable';
import { usersBookmarkTable } from '@/models/usersTable';

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
			.from(usersBookmarkTable)
			.where(
				and(
					eq(usersBookmarkTable.user_id, userId),
					eq(usersBookmarkTable.post_id, postId),
				),
			)
	)[0];

	return isSaved;
};
