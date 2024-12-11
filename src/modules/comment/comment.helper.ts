import { postCommentTable } from '@/models/postTable';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';

export const checkCommentExistence = async (commentId?: number) => {
	if (!commentId) {
		return false;
	}

	const exists = !!(
		await db
			.select()
			.from(postCommentTable)
			.where(eq(postCommentTable.id, commentId))
	)[0];

	return exists;
};

export const checkIfCommentAssociatedWithPost = async (
	postId?: number,
	commentId?: number,
) => {
	if (!postId || !commentId) {
		return false;
	}

	const exists = !!(
		await db
			.select()
			.from(postCommentTable)
			.where(
				and(
					eq(postCommentTable.id, commentId),
					eq(postCommentTable.post_id, postId),
				),
			)
	)[0];

	return exists;
};
