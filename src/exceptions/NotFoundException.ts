import { HttpError } from '@/types/HttpError.ts';

export class NotFoundException extends HttpError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}
