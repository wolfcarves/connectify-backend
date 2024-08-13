import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';

export const successResponseSchema = registry.register(
	'SuccessReponse',
	z.object({
		success: z.boolean(),
		message: z.string(),
	}),
);
