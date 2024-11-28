import { postCommentTable, postTable } from '@/models/postTable';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';

export const checkCommentExistence = async (commentId: number) => {
	const exists = !!(
		await db
			.select()
			.from(postTable)
			.where(and(eq(postCommentTable.id, commentId)))
	)[0];

	return exists;
};
