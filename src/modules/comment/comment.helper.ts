import { postCommentTable, postTable } from '@/models/postTable';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';

export const checkCommentExistence = async (commentId?: number) => {
	if (!commentId) {
		console.log('commentId is undefined');

		return false;
	}

	const exists = !!(
		await db
			.select()
			.from(postCommentTable)
			.where(and(eq(postCommentTable.id, commentId)))
	)[0];

	return exists;
};
