import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as userService from './user.service';

export const uploadUserProfileImage = asyncHandler(
	async (req: Request, res: Response) => {
		const file = req.file;
		const user = res.locals.user!;

		const result = await userService.uploadImage(user.id, file);

		res.status(200).send({
			success: true,
			message: result,
		});
	},
);

export const getUserProfile = asyncHandler(
	async (
		req: Request<{ userId: string }, never, never, never>,
		res: Response,
	) => {
		const userId = Number(req.params.userId);
		const result = await userService.findUserById(userId);

		res.status(200).send({
			success: true,
			data: result,
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
