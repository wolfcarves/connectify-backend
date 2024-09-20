import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

export const getFriendsSuggestions = asyncHandler(
	(req: Request, res: Response) => {
		res.status(200).json({
			message: 'nice',
		});
	},
);
