import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as engagementService from './engagement.service';
import { postCommentSchema } from './engagement.schema';

export const likePost = asyncHandler(async (req: Request, res: Response) => {
	const userId = res.locals.user!.id;
	const postId = Number(req.params.postId);

	const response = await engagementService.likePost(userId, postId);

	if (response.message === 'Liked')
		res.status(200).send({
			success: true,
			message: 'Liked Post',
		});
	else
		res.status(200).send({
			success: true,
			message: 'Disliked Post',
		});
});

export const createPostComment = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = res.locals.user!.id;
		const postId = Number(req.params.postId);

		const { comment } = await postCommentSchema.parseAsync(req.body);

		await engagementService.addComment(userId, postId, comment);

		res.status(200).send({
			success: true,
			message: 'Comment Added',
		});
	},
);

export const getPostComments = asyncHandler(
	async (req: Request, res: Response) => {
		const postId = Number(req.params.postId);

		const data = await engagementService.getComments(postId);

		res.status(200).json({
			success: true,
			data: data,
		});
	},
);
