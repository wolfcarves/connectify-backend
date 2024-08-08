import { HttpError } from '@/types/HttpError';

export class BadRequestException extends HttpError {
	constructor(message: string = 'Bad Request') {
		super(message, 400);
	}
}
