import { postTable } from '@/models/postTable';
import type { CreatePostInput } from './post.schema';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';

export const addPost = async (
	userId: number,
	{ content, audience }: CreatePostInput,
) => {
	return await db.insert(postTable).values({
		userId,
		content,
		audience,
	});
};

export const findOne = async (postId: number) => {
	return await db
		.select()
		.from(postTable)
		.where(eq(postTable.id, postId))
		.limit(1);
};

export const findAll = async (userId: number) => {
	return await db
		.select()
		.from(postTable)
		.where(eq(postTable.userId, userId));
};

export const deletePost = async (userId: number, postId: number) => {
	return await db
		.delete(postTable)
		.where(and(eq(postTable.userId, userId), eq(postTable.id, postId)))
		.returning({
			post_id: postTable.id,
		});
};
