import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const commentInputSchema = registry.register(
	'CommentInput',
	z.object({
		content: z.string().min(1, 'Comment should not be empty'),
	}),
);

export const commentSchema = registry.register(
	'Comment',
	commentInputSchema.extend({
		id: z.number(),
		user: z.object({
			id: z.number(),
			avatar: z.string(),
			name: z.string(),
			username: z.string(),
		}),
		content: z.string(),
		is_liked: z.boolean(),
		likes_count: z.number(),
		replies_count: z.number(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
);
