import { HttpError } from '@/types/HttpError.ts';

export class ConflictException extends HttpError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}
