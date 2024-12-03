import {
	postCommentTable,
	postReplyTable,
	postTable,
} from '@/models/postTable';
import { db } from '@/db';
import { asc, eq, count } from 'drizzle-orm';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { usersTable } from '@/models/usersTable';
import { checkPostExistence } from '../post/post.helper';

export const addComment = async (
	userId: number,
	postId: number,
	comment: string,
) => {
	const isPostExists = await checkPostExistence(postId);
	if (!isPostExists) throw new NotFoundException('Post not found');

	return await db.insert(postCommentTable).values({
		user_id: userId,
		post_id: postId,
		comment,
	});
};

export const getComments = async (postId: number) => {
	const isPostExists = await checkPostExistence(postId);
	if (!isPostExists) throw new NotFoundException('Post not found');

	const comments = await db
		.select({
			id: postCommentTable.id,
			user: {
				id: usersTable.id,
				avatar: usersTable.avatar,
				name: usersTable.name,
				username: usersTable.username,
			},
			comment: postCommentTable.comment,
			replies_count: count(postReplyTable.id),
			created_at: postCommentTable.created_at,
			updated_at: postCommentTable.updated_at,
		})
		.from(postCommentTable)
		.where(eq(postCommentTable.post_id, postId))
		.leftJoin(
			postReplyTable,
			eq(postReplyTable.comment_id, postCommentTable.id),
		)
		.innerJoin(postTable, eq(postCommentTable.post_id, postTable.id))
		.innerJoin(usersTable, eq(postCommentTable.user_id, usersTable.id))
		.orderBy(asc(postCommentTable.created_at))
		.groupBy(usersTable.id, postCommentTable.id);

	return comments;
};
