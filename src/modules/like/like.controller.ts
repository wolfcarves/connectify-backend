import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as engagementService from './like.service';

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
