import { HttpError } from '@/types/HttpError.ts';

export class ForbiddenException extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}
