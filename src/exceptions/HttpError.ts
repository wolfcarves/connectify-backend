import type { ZodIssue as BaseZodIssue } from 'zod';

export type ZodIssue = Omit<BaseZodIssue, 'code'>;

export class HttpError extends Error {
	statusCode: number;
	validationErrors?: ZodIssue[];

	constructor(
		message: string,
		statusCode: number,
		validationErrors?: ZodIssue[],
	) {
		super(message);
		this.statusCode = statusCode;
		this.validationErrors = validationErrors;
		Error.captureStackTrace(this, this.constructor);
	}
}