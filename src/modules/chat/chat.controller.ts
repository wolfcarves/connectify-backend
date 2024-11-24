import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

export const getChats = asyncHandler((req: Request, res: Response) => {
	res.status(200).json({
		data: '',
	});
});
