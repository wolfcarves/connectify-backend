import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as userService from './user.service';

export const uploadUserProfileImage = asyncHandler(
	async (req: Request, res: Response) => {
		const file = req.file;
		const user = res.locals.user!;

		const result = await userService.uploadImage(user, file);

		res.status(200).send({
			success: true,
			message: result,
		});
	},
);

export const getUserProfileImage = asyncHandler(
	async (_req: Request, res: Response) => {
		const user = res.locals.user!;

		const result = await userService.getProfileImage(user.id);

		res.status(200).send({
			success: true,
			data: result[0],
		});
	},
);
