import { HttpError } from '@/types/HttpError.ts';

export class ServerInternalException extends HttpError {
	constructor(message: string = 'Server Internal Error') {
		super(message, 500);
	}
}
