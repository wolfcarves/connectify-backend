import type { Request, Response } from 'express';
import type { RouteParams } from '@/types/request';
import asyncHandler from 'express-async-handler';
import * as replyService from './reply.service';

export const createReply = asyncHandler(
	async (
		req: Request<{ commentId: string }, never, { reply: string }, never>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		const commentId = Number(req.params.commentId);
		const reply = req.body.reply;

		await replyService.createReply(userId, commentId, reply);

		res.status(200).json({
			success: true,
			message: 'Reply posted',
		});
	},
);

export const getReplies = asyncHandler(
	async (req: RouteParams<{ commentId: string }>, res: Response) => {
		const commentId = Number(req.params.commentId);

		const data = await replyService.getReplies(commentId);

		res.status(200).json({
			data: data,
		});
	},
);
