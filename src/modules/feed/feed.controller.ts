import type { Response } from 'express';
import type { QueryParams } from '@/types/request';
import asyncHandler from 'express-async-handler';
import * as feedService from './feed.service';

export const getFeedWorldPosts = asyncHandler(
	async (
		req: QueryParams<{ page?: string; per_page?: string }>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;

		const page = Number(req.query.page) ?? 1;
		const perPage = Number(req.query.per_page) ?? 10;

		const posts = await feedService.getFeedWorldPosts(
			userId,
			page,
			perPage,
		);

		res.status(200).json({
			data: posts,
		});
	},
);

export const getFeedFriendsPosts = asyncHandler(
	async (
		req: QueryParams<{ page?: string; per_page?: string }>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;

		const page = Number(req.query.page) ?? 1;
		const perPage = Number(req.query.per_page) ?? 10;

		const posts = await feedService.getFeedFriendsPosts(
			userId,
			page,
			perPage,
		);

		res.status(200).json({
			data: posts,
		});
	},
);
