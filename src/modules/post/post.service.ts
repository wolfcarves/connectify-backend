/* eslint-disable @typescript-eslint/no-unused-vars */

import { postImagesTable, postLikeTable, postTable } from '@/models/postTable';
import type { audienceSchema, CreatePostInput } from './post.schema';
import { db } from '@/db';
import { and, desc, eq, inArray, ne, or, sql } from 'drizzle-orm';
import { bookmarkTable } from '@/models/bookmarkTable';
import { usersTable } from '@/models/usersTable';
import cloudinary from 'cloudinary';
import pLimit from 'p-limit';
import { ServerInternalException } from '@/exceptions/ServerInternalException';
import { deleteAllUploadedImages } from './post.helper';
import { NotFoundException } from '@/exceptions/NotFoundException';

export const addPost = async (
	userId: number,
	{ content, audience }: CreatePostInput,
	files?: Express.Request['files'],
): Promise<{ id: number; uuid: string } | undefined> => {
	let postUUID = '';

	try {
		const limit = pLimit(10);

		if (files && Array.isArray(files)) {
			const createPost = await db.transaction(async tx => {
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
							await cloudinary.v2.uploader
								.upload(file.path, {
									public_id: file.filename,
									folder: `posts/${post.uuid}`,
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
				return post;
			});

			return createPost;
		}

		const [post] = await db
			.insert(postTable)
			.values({
				user_id: userId,
				content,
				audience,
			})
			.returning({ id: postTable.id, uuid: postTable.uuid });

		return post;
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
		.selectDistinctOn([postTable.id], {
			post: {
				...postTable,
				images: sql.raw(`
						json_agg(
							CASE
								WHEN post_images.image IS NOT NULL THEN
									jsonb_build_object(
										'image', post_images.image,
										'created_at', post_images.created_at,
										'updated_at', post_images.updated_at
									)
							END
						) FILTER (WHERE post_images.image IS NOT NULL) AS images
				  `),
				is_saved: sql.raw(
					'bool_or(bookmark.id IS NOT NULL) as is_saved',
				),
				is_liked: sql.raw(
					'bool_or(post_likes.id IS NOT NULL) as is_liked',
				),
			},
			user: usersTable,
		})
		.from(postTable)
		.where(
			and(
				eq(postTable.user_id, paramUserId),
				or(
					eq(postTable.user_id, sessionUserId),
					ne(postTable.audience, 'private'),
				),
			),
		)
		.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
		.leftJoin(postImagesTable, eq(postImagesTable.post_id, postTable.id))
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
		.orderBy(desc(postTable.id))
		.limit(per_page)
		.offset((page - 1) * per_page)
		.groupBy(postTable.id, usersTable.id);

	return posts;
};

export const getUserPost = async (sessionUserId: number, uuid: string) => {
	const post = (
		await db
			.selectDistinctOn([postTable.id], {
				post: {
					...postTable,
					images: sql.raw(`
						json_agg(
							CASE
								WHEN post_images.image IS NOT NULL THEN
									jsonb_build_object(
										'image', post_images.image,
										'created_at', post_images.created_at,
										'updated_at', post_images.updated_at
									)
							END
						) FILTER (WHERE post_images.image IS NOT NULL) AS images
				  `),
					is_saved: sql.raw(
						'bool_or(bookmark.id IS NOT NULL) as is_saved',
					),
					is_liked: sql.raw(
						'bool_or(post_likes.id IS NOT NULL) as is_liked',
					),
				},
				user: usersTable,
			})
			.from(postTable)
			.where(eq(postTable.uuid, uuid))
			.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
			.leftJoin(
				postImagesTable,
				eq(postImagesTable.post_id, postTable.id),
			)
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
			.orderBy(desc(postTable.id))
			.groupBy(postTable.id, usersTable.id)
			.limit(1)
	)[0];

	return post;
};

export const deletePost = async (userId: number, postId: number) => {
	const deletedPost = (
		await db
			.delete(postTable)
			.where(and(eq(postTable.user_id, userId), eq(postTable.id, postId)))
			.returning({
				post_id: postTable.id,
				post_uuid: postTable.uuid,
			})
	)[0];

	const deletedPostId = deletedPost?.post_id;
	const deletedPostUUID = deletedPost?.post_uuid;
	await deleteAllUploadedImages(deletedPostUUID);

	if (!deletedPostId) throw new NotFoundException('Post not found');

	return deletedPost;
};

export const updatePostAudience = async (
	postId: number,
	audience: 'public' | 'friends' | 'private',
) => {
	return db
		.update(postTable)
		.set({
			audience,
		})
		.where(eq(postTable.id, postId));
};
