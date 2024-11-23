/* eslint-disable @typescript-eslint/no-unused-vars */
import { postLikeTable, postTable } from '@/models/postTable';
import type { CreatePostInput } from './post.schema';
import { db } from '@/db';
import { and, desc, eq } from 'drizzle-orm';
import { usersTable } from '@/models/usersTable';

export const addPost = async (
	userId: number,
	{ content, audience }: CreatePostInput,
) => {
	return await db.insert(postTable).values({
		user_id: userId,
		content,
		audience,
	});
};

export const getAllUserPosts = async (
	sessionUserId: number,
	paramUserId: number,
	page: number,
	per_page: number,
) => {
	const posts = await db
		.select()
		.from(postTable)
		.where(eq(postTable.user_id, paramUserId))
		.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
		.leftJoin(
			postLikeTable,
			and(
				eq(postLikeTable.user_id, sessionUserId),
				eq(postTable.id, postLikeTable.post_id),
			),
		)
		.orderBy(desc(postTable.created_at))
		.limit(per_page)
		.offset((page - 1) * per_page);

	const response = posts.map(p => {
		const isLiked = p.post_likes?.id ? true : false;

		const { user_id, ...restPost } = { ...p.post, isLiked };
		const { password, ...restUser } = p.user;

		return {
			post: restPost,
			user: restUser,
		};
	});

	return response;
};

export const findOne = async (sessionUserId: number, uuid: string) => {
	const post = (
		await db
			.select()
			.from(postTable)
			.where(eq(postTable.uuid, uuid))
			.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
			.leftJoin(
				postLikeTable,
				and(
					eq(postLikeTable.user_id, sessionUserId),
					eq(postTable.id, postLikeTable.post_id),
				),
			)
			.limit(1)
	)[0];

	const isLiked = post.post_likes?.id ? true : false;

	const { user_id, ...restPost } = { ...post.post, isLiked };
	const { password, ...restUser } = post.user;

	const response = {
		post: restPost,
		user: restUser,
	};

	return response;
};

export const deletePost = async (userId: number, postId: number) => {
	return await db
		.delete(postTable)
		.where(and(eq(postTable.user_id, userId), eq(postTable.id, postId)))
		.returning({
			post_id: postTable.id,
		});
};
