import type { ZodIssue } from 'zod';

export class HttpError extends Error {
	statusCode: number;
	validationErrors?: ZodIssue[];

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}
