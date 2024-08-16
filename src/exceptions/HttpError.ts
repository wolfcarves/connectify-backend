import type { ZodIssue } from 'zod';

export type ValidationErrors = Omit<ZodIssue, 'code'>;

export class HttpError extends Error {
	statusCode: number;
	validationErrors?: ValidationErrors[];

	constructor(
		message: string,
		statusCode: number,
		validationErrors?: ValidationErrors[],
	) {
		super(message);
		this.statusCode = statusCode;
		this.validationErrors = validationErrors;
		Error.captureStackTrace(this, this.constructor);
	}
}
