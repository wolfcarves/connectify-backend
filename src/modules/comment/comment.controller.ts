import type { Response } from 'express';
import type { QueryParams } from '@/types/request';
import asyncHandler from 'express-async-handler';
import { commentInputSchema } from './comment.schema';
import * as commentService from './comment.service';
import { COMMENTS_PER_PAGE } from './comment.constant';

export const createComment = asyncHandler(
	async (
		req: QueryParams<{ postId: string; commentId: string }>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		const postId = Number(req.query.postId);
		const commentId = Number(req.query.commentId);

		const { content } = await commentInputSchema.parseAsync(req.body);

		const createdComment = await commentService.addComment(
			userId,
			postId,
			commentId,
			content,
		);

		res.status(200).send({
			data: createdComment,
		});
	},
);

export const getComments = asyncHandler(
	async (
		req: QueryParams<{
			postId: string;
			commentId: string;
			page?: string;
			perPage?: string;
		}>,
		res: Response,
	) => {
		const userId = Number(res.locals.user?.id);
		const postId = Number(req.query.postId);
		const commentId = Number(req.query.commentId);

		const page = Number(req.query.page) || 1;
		const perPage = Number(req.query.perPage) || COMMENTS_PER_PAGE;

		const { comments, total, remaining } = await commentService.getComments(
			{
				userId,
				postId,
				commentId,
				page,
				perPage,
			},
		);

		res.status(200).json({
			data: comments,
			pagination: {
				current_page: page,
				total_items: total,
				remaining_items: remaining,
			},
		});
	},
);
