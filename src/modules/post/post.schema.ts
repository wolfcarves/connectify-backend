import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const createPostInputSchema = registry.register(
	'CreatePostInput',
	z.object({
		content: z
			.string()
			.min(1, 'Content is required')
			.max(5000, 'Maximum characters exceeded'),
		audience: z.enum(['public', 'private']).default('public').optional(),
	}),
);

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

export const postSchema = registry.register(
	'Post',
	createPostInputSchema.extend({
		id: z.number(),
		user_id: z.number(),
		likes: z.number(),
		commnets: z.number(),
		shares: z.number(),
	}),
);
