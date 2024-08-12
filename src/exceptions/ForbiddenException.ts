import { HttpError } from '@/exceptions/HttpError';

export class ForbiddenException extends HttpError {
	constructor(message: string = 'Forbidden') {
		super(message, 403);
	}
}
