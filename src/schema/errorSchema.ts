import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const badRequestErrorSchema = registry.register(
	'BadRequestError',
	z.object({
		error: z.object({
			message: z.string().openapi({ example: 'Bad Request' }),
			statusCode: z.number().openapi({ example: 404 }),
		}),
	}),
);

export const validationErrorSchema = registry.register(
	'ValidationError',
	z.object({
		message: z.string(),
		statusCode: z.number(),
		validationErrors: z.array(
			z.object({
				code: z.string(),
				validation: z.string(),
				message: z.string(),
				path: z.array(z.string()),
			}),
		),
	}),
);

export const notFoundErrorSchema = registry.register(
	'NotFoundError',
	z.object({
		error: z.object({
			message: z.string().openapi({ example: 'Not Found' }),
			statusCode: z.number().openapi({ example: 404 }),
		}),
	}),
);

export const conflictErrorSchema = registry.register(
	'ConflictError',
	z.object({
		error: z.object({
			message: z.string().openapi({ example: 'Conflict' }),
			statusCode: z.number().openapi({ example: 409 }),
		}),
	}),
);

export const unauthorizedErrorSchema = registry.register(
	'UnauthorizedError',
	z.object({
		error: z.object({
			message: z.string().openapi({ example: 'Unauthorized' }),
			statusCode: z.number().openapi({ example: 401 }),
		}),
	}),
);

export const serverErrorSchema = registry.register(
	'ServerInternalError',
	z.object({
		error: z.object({
			message: z.string().openapi({ example: 'Server Internal Error' }),
			statusCode: z.number().openapi({ example: 500 }),
		}),
	}),
);
