import type { Request, Response } from 'express';

export const createPost = (req: Request, res: Response) => {
	const user = res.locals.user;
};
