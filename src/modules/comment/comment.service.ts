import {
	postCommentTable,
	postReplyTable,
	postTable,
} from '@/models/postTable';
import { db } from '@/db';
import { asc, eq, count, sql } from 'drizzle-orm';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { usersTable } from '@/models/usersTable';
import { checkPostExistence } from '../post/post.helper';
import { checkCommentExistence } from './comment.helper';

export const addComment = async (
	userId: number,
	postId: number | undefined,
	commentId: number | undefined,
	comment: string,
): Promise<{ id: number }> => {
	const isPostExists = await checkPostExistence(postId);
	const isCommentExists = await checkCommentExistence(commentId);

	if (!isPostExists && !isCommentExists)
		throw new NotFoundException('Post or comment not found');

	if (postId) {
		return (
			await db
				.insert(postCommentTable)
				.values({
					user_id: userId,
					post_id: postId,
					comment,
				})
				.returning({ id: postCommentTable.id })
		)[0];
	}

	return (
		await db
			.insert(postCommentTable)
			.values({
				user_id: userId,
				comment_id: commentId,
				comment,
			})
			.returning({ id: postCommentTable.id })
	)[0];
};

export const getComments = async ({
	userId,
	postId,
	page,
	perPage,
}: {
	userId: number;
	postId: number;
	page: number;
	perPage: number;
}) => {
	const isPostExists = await checkPostExistence(postId);
	if (!isPostExists) throw new NotFoundException('Post not found');

	const commentsCount = (
		await db
			.select()
			.from(postCommentTable)
			.where(eq(postCommentTable.post_id, postId))
	).length;

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
		.orderBy(
			sql`CASE WHEN ${postCommentTable.user_id} = ${userId} THEN 0 ELSE 1 END`,
			asc(postCommentTable.created_at),
		)
		.groupBy(usersTable.id, postCommentTable.id)
		.offset((page - 1) * perPage)
		.limit(perPage);

	const itemsTaken = page * perPage;
	const remaining = commentsCount - itemsTaken;

	return {
		comments,
		total: commentsCount,
		remaining: Math.max(0, remaining),
	};
};
