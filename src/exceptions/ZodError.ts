import { HttpError, type ValidationErrors } from './HttpError';

export class ZodError extends HttpError {
	constructor(validationErrors?: ValidationErrors[]) {
		super('Validation Error', 400, validationErrors);
	}
}
