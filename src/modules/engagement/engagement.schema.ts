import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const commentInputSchema = registry.register(
	'CommentInput',
	z.object({
		comment: z.string().min(1, 'Comment should not be empty'),
	}),
);

export const commentSchema = registry.register(
	'Comment',
	commentInputSchema.extend({
		id: z.number(),
		user: z.object({
			id: z.number(),
			name: z.string(),
		}),
		comment: z.string(),
		created_at: z.date(),
		updated_at: z.date(),
	}),
);
