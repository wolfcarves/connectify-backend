import { HttpError, type ZodIssue } from './HttpError';

export class ZodError extends HttpError {
	constructor(validationErrors?: ZodIssue[]) {
		super('Validation Error', 400, validationErrors);
	}
}
