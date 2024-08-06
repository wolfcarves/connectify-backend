import { ZodValidation } from './ZodValidation.ts';

export class HttpError extends Error {
  statusCode: number;
  validationErrors?: ZodValidation;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
