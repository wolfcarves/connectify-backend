import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as engagementService from './like.service';
import type { RouteParams } from '@/types/request';

export const likePost = asyncHandler(async (req: Request, res: Response) => {
	const userId = res.locals.user!.id;
	const postId = Number(req.params.postId);

	const response = await engagementService.createPostLike(userId, postId);

	if (response?.message === 'Liked')
		res.status(200).send({
			success: true,
			message: 'Liked Post',
		});
	else if (response?.message === 'Disliked')
		res.status(200).send({
			success: true,
			message: 'Disliked Post',
		});
});

export const likeComment = asyncHandler(
	async (req: RouteParams<{ commentId: string }>, res: Response) => {
		const userId = res.locals.user!.id;
		const commentId = Number(req.params.commentId);

		const response = await engagementService.createCommentLike(
			userId,
			commentId,
		);

		if (response?.message === 'Liked')
			res.status(200).send({
				success: true,
				message: 'Liked Post',
			});
		else if (response?.message === 'Disliked')
			res.status(200).send({
				success: true,
				message: 'Disliked Post',
			});
	},
);
