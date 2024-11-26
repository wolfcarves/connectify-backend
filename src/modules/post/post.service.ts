/* eslint-disable @typescript-eslint/no-unused-vars */

import { postImagesTable, postLikeTable, postTable } from '@/models/postTable';
import type { CreatePostInput } from './post.schema';
import { db } from '@/db';
import { and, desc, eq } from 'drizzle-orm';
import { bookmarkTable } from '@/models/bookmarkTable';
import { usersTable } from '@/models/usersTable';
import cloudinary from 'cloudinary';
import pLimit from 'p-limit';
import { ServerInternalException } from '@/exceptions/ServerInternalException';
import { deleteAllUploadedImages } from './post.helper';

export const addPost = async (
	userId: number,
	{ content, audience }: CreatePostInput,
	files?: Express.Request['files'],
) => {
	let postUUID = '';

	try {
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
					.returning({ id: postTable.id, uuid: postTable.uuid });

				postUUID = post.uuid;

				const imagesToUpload = files.map(
					(file: Express.Multer.File, idx: number) => {
						return limit(async () => {
							const response = await cloudinary.v2.uploader
								.upload(file.path, {
									public_id: file.filename,
									folder: `post/${post.uuid}`,
									resource_type: 'image',
								})
								// Delete all uploaded files when one of the images fail
								.catch(async () => {
									await deleteAllUploadedImages(post.uuid);
									throw new ServerInternalException(
										'Image failed to upload',
									);
								});

							await tx.insert(postImagesTable).values({
								post_id: post.id,
								image: file.filename,
								mime_type: file.mimetype,
							});
						});
					},
				);

				await Promise.all(imagesToUpload);
			});

			return;
		}

		await db.insert(postTable).values({
			user_id: userId,
			content,
			audience,
		});
	} catch (error) {
		if (error instanceof ServerInternalException) {
			await deleteAllUploadedImages(postUUID ?? '');
			postUUID = '';
			throw new ServerInternalException(
				error.message ?? 'Something went wrong',
			);
		}
	}
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
