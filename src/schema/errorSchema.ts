import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const validationErrorSchema = registry.register(
	'ValidationError',
	z.object({
		message: z.string().openapi({ example: 'Conflict' }),
		statusCode: z.number().openapi({ example: 400 }),
		validationError: z.array(
			z.object({
				validation: z.string(),
				code: z.string(),
				message: z.string(),
				path: z.array(z.string()),
			}),
		),
	}),
);

export const conflictErrorSchema = registry.register(
	'ConflictError',
	z.object({
		message: z.string().openapi({ example: 'Conflict' }),
		statusCode: z.number().openapi({ example: 409 }),
	}),
);

export const unauthorizedErrorSchema = registry.register(
	'UnauthorizedError',
	z.object({
		message: z.string().openapi({ example: 'Unauthorized' }),
		statusCode: z.number().openapi({ example: 401 }),
	}),
);

export const serverErrorSchema = registry.register(
	'ServerInternalError',
	z.object({
		message: z.string().openapi({ example: 'Server Internal Error' }),
		statusCode: z.number().openapi({ example: 500 }),
	}),
);
