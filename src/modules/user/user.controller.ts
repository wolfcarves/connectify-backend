import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as userService from './user.service';
import type { QueryParams } from '@/types/request';
import {
	checkIfFriend,
	checkIfHasFriendRequest,
} from '../friend/friend.helper';

export const uploadUserProfileImage = asyncHandler(
	async (req: Request, res: Response) => {
		const file = req.file;
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
		const isFriend = await checkIfFriend(user?.id, result.id);
		const { hasRequest, requestFrom } = await checkIfHasFriendRequest(
			user?.id,
			result.id,
			isFriend,
		);

		res.status(200).send({
			success: true,
			data: {
				...result,
				isFriend,
				hasRequest,
				requestFrom,
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
