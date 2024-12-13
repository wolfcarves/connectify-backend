/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Request, Response } from 'express';
import {
	audienceSchema,
	createPostInputSchema,
	type CreatePostInput,
} from './post.schema';
import asyncHandler from 'express-async-handler';
import * as postService from './post.service';
import * as userService from '../user/user.service';
import { NotFoundException } from '@/exceptions/NotFoundException';
import type { RouteAndQueryParams } from '@/types/request';
import validateUUID from '@/utils/validateUUID';

export const createPost = asyncHandler(
	async (
		req: Request<never, never, CreatePostInput, never>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		const parsedInput = await createPostInputSchema.parseAsync(req.body);

		const createdPost = await postService.addPost(
			userId,
			parsedInput,
			req.files,
		);

		res.status(201).json({
			data: createdPost,
		});
	},
);

export const getUserPosts = asyncHandler(
	async (
		req: RouteAndQueryParams<
			{ username: string },
			{ page: string; per_page: string }
		>,
		res: Response,
	) => {
		const sessionUserId = res.locals.user!.id;
		const paramsUsername = req.params.username;

		const page = Number(req.query.page) ?? 1;
		const perPage = Number(req.query.per_page) ?? 10;

		const user = await userService.getUser({ username: paramsUsername });

		const posts = await postService.getAllUserPosts(
			sessionUserId,
			user.id,
			page,
			perPage,
		);

		if (posts.length === 0) throw new NotFoundException('No posts found');

		res.status(200).json({
			data: posts,
		});
	},
);

export const getUserPost = asyncHandler(async (req: Request, res: Response) => {
	const sessionUserId = Number(res.locals.user!.id);
	const uuid = req.params.uuid;

	if (!validateUUID(uuid)) throw new NotFoundException('Post not found');
	const post = await postService.getUserPost(sessionUserId, uuid);

	// allow user to view if he owns the post
	const ableToView =
		post?.post.audience === 'private' && sessionUserId !== post?.user.id;

	if (!post.post.id) throw new NotFoundException('Post not found');
	if (ableToView) throw new NotFoundException('Post not found');

	res.status(200).json({
		data: post,
	});
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
	const userId = Number(res.locals.user!.id);
	const postId = Number(req.params.postId);

	const deletedPost = await postService.deletePost(userId, postId);

	res.status(200).json({
		sucess: true,
		message: `The post (${deletedPost.post_id}) is successfully deleted`,
	});
});

export const changeAudience = asyncHandler(
	async (
		req: Request<{ postId: string }, never, { audience: string }, never>,
		res: Response,
	) => {
		const postId = Number(req.params.postId);

		const audience = await audienceSchema.parseAsync(req.body.audience);

		await postService.updatePostAudience(Number(postId), audience);

		res.status(200).json({
			sucess: true,
			message: 'Audience updated',
		});
	},
);
