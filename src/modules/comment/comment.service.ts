import {
	postCommentLikeTable,
	postCommentTable,
	postTable,
} from '@/models/postTable';
import { db } from '@/db';
import {
	asc,
	eq,
	sql,
	aliasedTable,
	and,
	isNull,
	count,
	isNotNull,
	countDistinct,
	desc,
} from 'drizzle-orm';
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
): Promise<{
	id: number;
	post_id: number | null;
	comment_id: number | null;
	content: string;
}> => {
	const isPostExists = await checkPostExistence(postId);

	if (!isPostExists) throw new NotFoundException('Resource not found');

	return (
		await db
			.insert(postCommentTable)
			.values({
				user_id: userId,
				post_id: postId,
				comment_id: commentId || null,
				content,
			})
			.returning({
				id: postCommentTable.id,
				post_id: postCommentTable.post_id,
				comment_id: postCommentTable.comment_id,
				content: postCommentTable.content,
			})
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
		throw new NotFoundException('Resource not found');

	if (commentId) {
		const _isCommentAssociatedWithPost =
			await checkIfCommentAssociatedWithPost(postId, commentId);

		if (!_isCommentAssociatedWithPost)
			throw new NotFoundException('Comment not found');
	}

	const postRepliesTable = aliasedTable(postCommentTable, 'post_replies');
	const postCommentLikeTable2 = aliasedTable(
		postCommentLikeTable,
		'post_comment_likes_2',
	);

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
			is_liked: isNotNull(postCommentLikeTable.id),
			likes_count: countDistinct(postCommentLikeTable2.id),
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
			postCommentLikeTable,
			and(
				eq(postCommentLikeTable.user_id, userId),
				eq(postCommentLikeTable.comment_id, postCommentTable.id),
			),
		)
		.leftJoin(
			postCommentLikeTable2,
			eq(postCommentLikeTable2.comment_id, postCommentTable.id),
		)
		.leftJoin(
			postRepliesTable,
			commentId
				? eq(postRepliesTable.comment_id, postCommentTable.id)
				: eq(postRepliesTable.comment_id, postCommentTable.id),
		)
		.innerJoin(postTable, eq(postCommentTable.post_id, postTable.id))
		.innerJoin(usersTable, eq(postCommentTable.user_id, usersTable.id))
		.orderBy(
			sql`CASE WHEN ${postCommentTable.user_id} = ${userId} THEN 0 ELSE 1 END`,
			desc(postCommentTable.created_at),
		)
		.groupBy(usersTable.id, postCommentTable.id, postCommentLikeTable.id)
		.offset((page - 1) * perPage)
		.limit(perPage);

	if (comments.length === 0) throw new NotFoundException('No comments found');

	let totalCount: number = 0;

	if (postId)
		totalCount = (
			await db
				.select()
				.from(postCommentTable)
				.where(
					and(
						eq(postCommentTable.post_id, postId),
						isNull(postCommentTable.comment_id),
					),
				)
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
		total_items: totalCount,
		remaining_items: Math.max(0, remaining),
	};
};
