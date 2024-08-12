import { HttpError } from '@/exceptions/HttpError';

export class ServerInternalException extends HttpError {
	constructor(message: string = 'Server Internal Error') {
		super(message, 500);
	}
}
