import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const replyInputSchema = registry.register(
	'ReplyInput',
	z.object({
		comment: z.string().min(1, 'Reply should not be empty'),
	}),
);

export const replySchema = registry.register(
	'Reply',
	replyInputSchema.extend({
		id: z.number(),
		user: z.object({
			id: z.number(),
			avatar: z.string(),
			name: z.string(),
			username: z.string(),
		}),
		reply: z.string(),
		created_at: z.date(),
		updated_at: z.date(),
	}),
);
