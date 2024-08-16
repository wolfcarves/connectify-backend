import { postTable } from '@/models/postTable';
import type { CreatePostInput } from './post.schema';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';

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

export const findOne = async (postId: number) => {
	const post = (
		await db
			.select()
			.from(postTable)
			.where(eq(postTable.id, postId))
			.limit(1)
	)[0];

	return post;
};

export const findAll = async (userId: number) => {
	return await db
		.selectDistinctOn([postTable.created_at])
		.from(postTable)
		.where(eq(postTable.user_id, userId))
		.orderBy(postTable.created_at);
};

export const deletePost = async (userId: number, postId: number) => {
	return await db
		.delete(postTable)
		.where(and(eq(postTable.user_id, userId), eq(postTable.id, postId)))
		.returning({
			post_id: postTable.id,
		});
};
