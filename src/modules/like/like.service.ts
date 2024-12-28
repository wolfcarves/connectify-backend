import { postCommentLikeTable, postLikeTable } from '@/models/postTable';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { NotFoundException } from '@/exceptions/NotFoundException';
import {
	checkCommentLikeExistence,
	checkPostLikeExistence,
} from './like.helper';
import postgres from 'postgres';

export const createPostLike = async (userId: number, postId: number) => {
	try {
		const isLiked = await checkPostLikeExistence(userId, postId);

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
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			// Post doesn't exists
			if (error.code === '23503') {
				throw new NotFoundException('Post not found');
			}
		}

		throw error;
	}
};

export const createCommentLike = async (userId: number, commentId: number) => {
	try {
		const isLiked = await checkCommentLikeExistence(userId, commentId);

		if (isLiked) {
			await db
				.delete(postCommentLikeTable)
				.where(
					and(
						eq(postCommentLikeTable.comment_id, commentId),
						eq(postCommentLikeTable.user_id, userId),
					),
				);

			return {
				message: 'Disliked',
			};
		}

		await db.insert(postCommentLikeTable).values({
			user_id: userId,
			comment_id: commentId,
		});

		return {
			message: 'Liked',
		};
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			// Comment doesn't exists
			if (error.code === '23503') {
				throw new NotFoundException('Comment not found');
			}
		}

		throw error;
	}
};
