import { postCommentTable, postTable } from '@/models/postTable';
import { db } from '@/db';
import { asc, eq, sql, aliasedTable, and, isNull, count } from 'drizzle-orm';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { usersTable } from '@/models/usersTable';
import { checkPostExistence } from '../post/post.helper';
import {
	checkCommentExistence,
	checkIfCommentAssociatedWithPost,
} from './comment.helper';

export const addComment = async (
	userId: number,
	postId: number | undefined,
	commentId: number | undefined,
	content: string,
): Promise<{ id: number }> => {
	const isPostExists = await checkPostExistence(postId);

	if (!isPostExists) throw new NotFoundException('Resources not found');

	return (
		await db
			.insert(postCommentTable)
			.values({
				user_id: userId,
				post_id: postId,
				comment_id: commentId || null,
				content,
			})
			.returning({ id: postCommentTable.id })
	)[0];
};

export const getComments = async ({
	userId,
	postId,
	commentId,
	page,
	perPage,
}: {
	userId: number;
	postId: number;
	commentId: number;
	page: number;
	perPage: number;
}) => {
	const isPostExists = await checkPostExistence(postId);
	const isCommentExists = await checkCommentExistence(commentId);
	if (!isPostExists && !isCommentExists)
		throw new NotFoundException('Resources not found');

	if (commentId) {
		const _isCommentAssociatedWithPost =
			await checkIfCommentAssociatedWithPost(postId, commentId);

		if (!_isCommentAssociatedWithPost)
			throw new NotFoundException('Comment not found');
	}

	const postRepliesTable = aliasedTable(postCommentTable, 'post_replies');

	const comments = await db
		.select({
			id: postCommentTable.id,
			user: {
				id: usersTable.id,
				avatar: usersTable.avatar,
				name: usersTable.name,
				username: usersTable.username,
			},
			content: postCommentTable.content,
			replies_count: count(postRepliesTable.id),
			created_at: postCommentTable.created_at,
			updated_at: postCommentTable.updated_at,
		})
		.from(postCommentTable)
		.where(
			commentId
				? and(
						eq(postCommentTable.post_id, postId),
						eq(postCommentTable.comment_id, commentId),
					)
				: and(
						eq(postCommentTable.post_id, postId),
						isNull(postCommentTable.comment_id),
					),
		)
		.leftJoin(
			postRepliesTable,
			commentId
				? eq(postCommentTable.id, postRepliesTable.comment_id)
				: eq(postCommentTable.id, postRepliesTable.comment_id),
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

	let totalCount: number = 0;

	if (postId)
		totalCount = (
			await db
				.select()
				.from(postCommentTable)
				.where(eq(postCommentTable.post_id, postId))
		).length;

	if (commentId)
		totalCount = (
			await db
				.select()
				.from(postCommentTable)
				.where(eq(postCommentTable.comment_id, commentId))
		).length;

	const itemsTaken = page * perPage;
	const remaining = totalCount - itemsTaken;

	return {
		comments,
		total: totalCount,
		remaining: Math.max(0, remaining),
	};
};
