import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const serverErrorSchema = registry.register(
	'ServerError',
	z.object({
		message: z.string(),
		statusCode: z.number(),
	}),
);
