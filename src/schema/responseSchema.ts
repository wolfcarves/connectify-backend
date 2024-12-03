import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';

export const successResponseSchema = registry.register(
	'SuccessReponse',
	z.object({
		success: z.boolean(),
		message: z.string(),
	}),
);

export const paginationResponseSchema = registry.register(
	'Pagination',
	z.object({
		page: z.number(),
		total_items: z.number(),
		remaining_items: z.number(),
	}),
);
