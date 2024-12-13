import type { Response } from 'express';
import type { QueryParams, RouteParams } from '@/types/request';
import asyncHandler from 'express-async-handler';
import { ConflictException } from '@/exceptions/ConflictException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import * as bookmarkService from './bookmark.service';

export const getBookmarks = asyncHandler(
	async (
		req: QueryParams<{ page: string; per_page: string }>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;

		const page = Number(req.query.page) ?? 1;
		const perPage = Number(req.query.per_page) ?? 15;

		const bookmarks = await bookmarkService.getBookmarks(
			userId,
			page,
			perPage,
		);

		res.status(200).json({
			data: bookmarks,
		});
	},
);

export const savePost = asyncHandler(
	async (req: RouteParams<{ postId: string }>, res: Response) => {
		const userId = res.locals.user!.id;
		const postId = Number(req.params.postId);

		if (!postId) throw new NotFoundException('Post not found');

		const savePost = await bookmarkService.savePost(userId, postId);

		if (!savePost) throw new ConflictException('This post already saved');

		res.status(200).json({
			sucess: true,
			message: 'Post saved',
		});
	},
);

export const usSavePost = asyncHandler(
	async (req: RouteParams<{ postId: string }>, res: Response) => {
		const userId = res.locals.user!.id;
		const postId = Number(req.params.postId);

		if (!userId || !postId) throw new NotFoundException('Post not found');

		const unSavePost = await bookmarkService.unSavePost(userId, postId);

		if (!unSavePost) throw new NotFoundException('Post not found');

		res.status(200).json({
			sucess: true,
			message: 'Post unsaved',
		});
	},
);
