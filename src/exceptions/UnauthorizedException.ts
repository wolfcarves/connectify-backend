import { HttpError } from '@/types/HttpError.ts';

export class UnauthorizedException extends HttpError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401);
	}
}
