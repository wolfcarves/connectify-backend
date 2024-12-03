import type { Request, Response } from 'express';
import type { RouteAndQueryParams } from '@/types/request';
import asyncHandler from 'express-async-handler';
import { commentInputSchema } from './comment.schema';
import * as commentService from './comment.service';
import { COMMENTS_PER_PAGE } from './comment.constant';

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
	async (
		req: RouteAndQueryParams<
			{ postId: string },
			{ page?: string; per_page?: string }
		>,
		res: Response,
	) => {
		const postId = Number(req.params.postId);

		const page = Number(req.query.page);
		const perPage = Number(req.query.per_page) ?? COMMENTS_PER_PAGE;

		const { comments, total, remaining } = await commentService.getComments(
			{
				postId,
				page,
				perPage,
			},
		);

		res.status(200).json({
			data: comments,
			pagination: {
				page,
				total_items: total,
				remaining_items: remaining,
			},
		});
	},
);
