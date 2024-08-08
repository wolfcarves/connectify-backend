import { HttpError } from '@/types/HttpError';

export class ServerInternalException extends HttpError {
	constructor(message: string = 'Server Internal Error') {
		super(message, 500);
	}
}
