import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as userService from './user.service';
import type { QueryParams } from '@/types/request';
import { checkFriendStatus } from '../friend/friend.helper';
import { NotFoundException } from '@/exceptions/NotFoundException';

export const uploadUserProfileImage = asyncHandler(
	async (req: Request, res: Response) => {
		const file = req.file;

		if (!file) throw new NotFoundException('No image file received');

		const user = res.locals.user!;

		const result = await userService.uploadUserProfileImage(user.id, file);

		res.status(200).send({
			success: true,
			message: result,
		});
	},
);

export const getUserProfile = asyncHandler(
	async (
		req: QueryParams<{ userId?: string; username?: string }>,
		res: Response,
	) => {
		const user = res.locals.user!;

		const query = {
			...req.query,
			userId: req.query.userId ? parseInt(req.query.userId) : undefined,
		};

		const result = await userService.getUser(query);

		const { is_friend, has_request, request_from } =
			await checkFriendStatus(user?.id, result.id);

		res.status(200).send({
			success: true,
			data: {
				...result,
				is_friend,
				has_request,
				request_from,
			},
		});
	},
);

export const deleteUserProfileImage = asyncHandler(
	async (_req: Request, res: Response) => {
		const user = res.locals.user!;

		await userService.deleteUserProfileImage(user.id);

		res.status(200).send({
			success: true,
			message: 'Profile image removed',
		});
	},
);
