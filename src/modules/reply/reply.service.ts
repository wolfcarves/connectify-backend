import { db } from '@/db';
import { postReplyTable } from '@/models/postTable';
import { checkCommentExistence } from '../like/like.helper';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { desc, eq } from 'drizzle-orm';
import { usersTable } from '@/models/usersTable';

export const createReply = async (
	userId: number,
	commentId: number,
	reply: string,
) => {
	if (!checkCommentExistence(commentId))
		throw new NotFoundException('Comment Not Found');

	return await db.insert(postReplyTable).values({
		user_id: userId,
		comment_id: commentId,
		reply,
	});
};

export const getReplies = async (commentId: number) => {
	const isCommentExists = await checkCommentExistence(commentId);
	if (!isCommentExists) throw new NotFoundException('Comment not found');

	const replies = await db
		.select({
			id: postReplyTable.id,
			user: {
				id: usersTable.id,
				avatar: usersTable.avatar,
				name: usersTable.name,
				username: usersTable.username,
			},
			reply: postReplyTable.reply,
			created_at: postReplyTable.created_at,
			updated_at: postReplyTable.updated_at,
		})
		.from(postReplyTable)
		.where(eq(postReplyTable.comment_id, commentId))
		.innerJoin(usersTable, eq(postReplyTable.user_id, usersTable.id))
		.orderBy(desc(postReplyTable.created_at));

	return replies;
};
