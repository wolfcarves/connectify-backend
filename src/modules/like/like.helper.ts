import { postCommentTable, postLikeTable } from '@/models/postTable';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';

export const checkLikeExistence = async (userId: number, postId: number) => {
	const exists = !!(
		await db
			.select()
			.from(postLikeTable)
			.where(
				and(
					eq(postLikeTable.user_id, userId),
					eq(postLikeTable.post_id, postId),
				),
			)
	)[0];

	return exists;
};

export const checkCommentExistence = async (commentId: number) => {
	const exists = !!(
		await db
			.select()
			.from(postCommentTable)
			.where(and(eq(postCommentTable.id, commentId)))
	)[0];

	return exists;
};
