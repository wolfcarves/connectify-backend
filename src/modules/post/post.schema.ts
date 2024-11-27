import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const createPostInputSchema = registry.register(
	'CreatePostInput',
	z.object({
		images: z.any(),
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
	createPostInputSchema.omit({ images: true }).extend({
		id: z.number(),
		uuid: z.string(),
		is_saved: z.boolean(),
		is_liked: z.boolean(),
		images: z.array(
			z.object({
				image: z.string(),
				created_at: z.date(),
				updated_at: z.date(),
			}),
		),
		created_at: z.date(),
		updated_at: z.date(),
	}),
);

export const audienceSchema = registry.register(
	'Audience',
	z.enum(['public', 'friends', 'private']),
);
