/* eslint-disable @typescript-eslint/no-unused-vars */

import { postImagesTable, postLikeTable, postTable } from '@/models/postTable';
import type { CreatePostInput } from './post.schema';
import { db } from '@/db';
import { and, desc, eq } from 'drizzle-orm';
import { bookmarkTable } from '@/models/bookmarkTable';
import { usersTable } from '@/models/usersTable';
import cloudinary from 'cloudinary';
import pLimit from 'p-limit';

export const addPost = async (
	userId: number,
	{ content, audience }: CreatePostInput,
	files?: Express.Request['files'],
) => {
	const limit = pLimit(10);

	if (files && Array.isArray(files)) {
		await db.transaction(async tx => {
			const [post] = await tx
				.insert(postTable)
				.values({
					user_id: userId,
					content,
					audience,
				})
				.returning({ id: postTable.id });

			const imagesToUpload = files.map((file: Express.Multer.File) => {
				return limit(async () => {
					await cloudinary.v2.uploader.upload(file.path, {
						public_id: file.filename,
						folder: 'user-post',
						resource_type: 'image',
					});

					await tx.insert(postImagesTable).values({
						post_id: post.id,
						image: file.filename,
						mime_type: file.mimetype,
					});
				});
			});

			await Promise.all(imagesToUpload);
		});

		return;
	}

	await db.insert(postTable).values({
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
			bookmarkTable,
			and(
				eq(bookmarkTable.user_id, sessionUserId),
				eq(bookmarkTable.post_id, postTable.id),
			),
		)
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
		const isSaved = !!p.bookmark?.id;
		const isLiked = !!p.post_likes?.id;

		const { user_id, ...restPost } = { ...p.post, isLiked, isSaved };
		const { password, ...restUser } = p.user;

		return {
			post: restPost,
			user: restUser,
		};
	});

	return response;
};

export const getUserPost = async (sessionUserId: number, uuid: string) => {
	const post = (
		await db
			.select()
			.from(postTable)
			.where(eq(postTable.uuid, uuid))
			.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
			.leftJoin(
				bookmarkTable,
				and(
					eq(bookmarkTable.user_id, sessionUserId),
					eq(bookmarkTable.post_id, postTable.id),
				),
			)
			.leftJoin(
				postLikeTable,
				and(
					eq(postLikeTable.user_id, sessionUserId),
					eq(postTable.id, postLikeTable.post_id),
				),
			)
			.limit(1)
	)[0];

	const isSaved = !!post.bookmark?.id;
	const isLiked = !!post.post_likes?.id;

	const { user_id, ...restPost } = { ...post.post, isLiked, isSaved };
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
