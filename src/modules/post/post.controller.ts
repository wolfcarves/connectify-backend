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

export const getUserPost = asyncHandler(async (req: Request, res: Response) => {
	const userId = Number(res.locals.user!.id);
	const postId = Number(req.params.postId);

	const findPostResponse = await postService.findOne(postId);
	const post = findPostResponse?.[0];

	// allow user to view if he owns the post
	const ableToView = post?.audience === 'private' && userId !== post?.userId;

	if (!post?.id) {
		throw new NotFoundException('Post not found');
	}

	if (ableToView) {
		throw new NotFoundException('Post not found');
	}

	res.status(200).json({
		data: post,
	});
});

export const getUserPosts = asyncHandler(
	async (
		req: Request<{ userId: string }, never, never, never>,
		res: Response,
	) => {
		const params = req.params;

		const posts = await postService.findAll(Number(params.userId));

		if (posts.length === 0) throw new NotFoundException('No posts found');

		res.status(200).json({
			data: posts,
		});
	},
);

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
