import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as userService from '../user/user.service';

export const getFriendsSuggestions = asyncHandler(
	async (req: Request, res: Response) => {
		const suggestedFriends = await userService.getAllUsers({
			limit: 10,
		});

		res.status(200).json({
			data: suggestedFriends,
		});
	},
);

export const sendFriendRequest = asyncHandler(
	async (req: Request, res: Response) => {
		const suggestedFriends = await userService.getAllUsers({
			limit: 10,
		});

		res.status(200).json({
			data: suggestedFriends,
		});
	},
);
