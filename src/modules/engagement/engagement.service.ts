import { postCommentTable, postLikeTable, postTable } from '@/models/postTable';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { checkLikeExistence, checkPostExistence } from './engagement.helper';
import { userTable } from '@/models/userTable';

export const likePost = async (userId: number, postId: number) => {
	const isLiked = await checkLikeExistence(userId, postId);
	const isPostExists = await checkPostExistence(postId);

	if (!isPostExists) throw new NotFoundException('Post not found');

	if (isLiked) {
		await db
			.delete(postLikeTable)
			.where(
				and(
					eq(postLikeTable.post_id, postId),
					eq(postLikeTable.user_id, userId),
				),
			);

		return {
			message: 'Disliked',
		};
	}

	await db.insert(postLikeTable).values({
		user_id: userId,
		post_id: postId,
	});

	return {
		message: 'Liked',
	};
};

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
	return await db
		.select({
			id: postCommentTable.id,
			user: {
				id: userTable.id,
				name: userTable.name,
			},
			comment: postCommentTable.comment,
			created_at: postCommentTable.created_at,
			updated_at: postCommentTable.updated_at,
		})
		.from(postCommentTable)
		.where(eq(postCommentTable.post_id, postId))
		.innerJoin(postTable, eq(postCommentTable.post_id, postTable.id))
		.innerJoin(userTable, eq(postCommentTable.user_id, userTable.id));
};
