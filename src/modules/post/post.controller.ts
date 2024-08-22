/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from 'express';
import { createPostInputSchema, type CreatePostInput } from './post.schema';
import asyncHandler from 'express-async-handler';
import * as postService from './post.service';
import { NotFoundException } from '@/exceptions/NotFoundException';

export const createPost = asyncHandler(
	async (
		req: Request<never, never, CreatePostInput, never>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		const parsedInput = await createPostInputSchema.parseAsync(req.body);

		await postService.addPost(userId, parsedInput);

		res.status(201).json({
			success: true,
			message: 'Posted successfully',
		});
	},
);

export const getPosts = asyncHandler(
	async (
		req: Request<
			{ userId: string },
			never,
			never,
			{ page: string; per_page: string }
		>,
		res: Response,
	) => {
		const sessionUserId = res.locals.user!.id;
		const paramUserId = Number(req.params.userId);

		const page = Number(req.query.page) ?? 1;
		const per_page = Number(req.query.per_page) ?? 10;

		const posts = await postService.findAll(
			sessionUserId,
			paramUserId,
			page,
			per_page,
		);

		if (posts.length === 0) throw new NotFoundException('No posts found');

		res.status(200).json({
			data: posts,
		});
	},
);

export const getPost = asyncHandler(async (req: Request, res: Response) => {
	const userId = Number(res.locals.user!.id);
	const postId = Number(req.params.postId);

	const post = await postService.findOne(postId);

	// allow user to view if he owns the post
	const ableToView =
		post?.post.audience === 'private' && userId !== post?.user.id;

	if (!post.post.id) {
		throw new NotFoundException('Post not found');
	}

	if (ableToView) {
		throw new NotFoundException('Post not found');
	}

	res.status(200).json({
		data: post,
	});
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
	const userId = Number(res.locals.user!.id);
	const postId = Number(req.params.postId);

	const deletedPost = await postService.deletePost(userId, postId);
	const deletedPostId = deletedPost?.[0]?.post_id;

	if (!deletedPostId) throw new NotFoundException('Post not found');

	res.status(200).json({
		sucess: true,
		message: `The post (${deletedPostId}) is successfully deleted`,
	});
});
