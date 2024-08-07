import 'dotenv/config';

import { HttpError } from '@/types/HttpError.ts';
import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const zodErrorHandler = (
	err: HttpError,
	_req: Request,
	_res: Response,
	next: NextFunction,
) => {
	if (err instanceof ZodError) {
		const zodError = new HttpError(err.message, err.statusCode);

		zodError.message = 'Validation Error!!!';
		zodError.statusCode = 400;
		zodError.validationErrors = err.formErrors.fieldErrors;

		next(zodError);
	} else {
		next(err);
	}
};

export const errorHandler = (
	err: HttpError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	const stack = err.stack;
	const validationError = err.validationErrors;

	res.status(statusCode).json({
		error: {
			message,
			statusCode,
			validationError,
			stack: process.env.NODE_ENV === 'development' ? stack : '',
		},
	});
};

export const notFoundHandler = (
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const message = 'Route not found';
	const statusCode = 404;

	res.status(statusCode).json({
		error: {
			message,
			statusCode,
		},
	});
};
