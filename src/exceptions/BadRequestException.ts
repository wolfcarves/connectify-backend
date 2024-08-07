import { HttpError } from '@/types/HttpError.ts';

export class BadRequestException extends HttpError {
	constructor(message: string = 'Bad Request') {
		super(message, 400);
	}
}
