import type { Request, Response } from 'express';
import type { RouteParams } from '@/types/request';
import asyncHandler from 'express-async-handler';
import { commentInputSchema } from './comment.schema';
import * as commentService from './comment.service';

export const createComment = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = res.locals.user!.id;
		const postId = Number(req.params.postId);

		const { comment } = await commentInputSchema.parseAsync(req.body);

		await commentService.addComment(userId, postId, comment);

		res.status(200).send({
			success: true,
			message: 'Comment Added',
		});
	},
);

export const getComments = asyncHandler(
	async (req: RouteParams<{ postId: string }>, res: Response) => {
		const postId = Number(req.params.postId);

		const data = await commentService.getComments(postId);

		res.status(200).json({
			data: data,
		});
	},
);
