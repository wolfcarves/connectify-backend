import { postLikeTable } from '@/models/postTable';
import { db } from '@/db';
import { and, asc, eq } from 'drizzle-orm';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { checkLikeExistence } from './like.helper';
import { checkPostExistence } from '../post/post.helper';

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
