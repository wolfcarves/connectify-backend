import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const createPostInputSchema = registry.register(
	'CreatePostInput',
	z.object({
		content: z
			.string()
			.min(1, 'Content is required')
			.max(5000, 'Maximum characters exceeded'),
		audience: z
			.enum(['public', 'friends', 'private'])
			.default('public')
			.optional(),
	}),
);

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

export const postSchema = registry.register(
	'Post',
	createPostInputSchema.extend({
		id: z.number(),
		uuid: z.string(),
		isSaved: z.boolean(),
		isLiked: z.boolean(),
		created_at: z.date(),
		updated_at: z.date(),
	}),
);
