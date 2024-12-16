import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';

export const chatSchema = registry.register(
	'Chat',
	z.object({
		id: z.number(),
		group_name: z.string().nullable(),
		avatar: z.string(),
		username: z.string(),
		name: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
);

export const chatMessageSchema = registry.register(
	'ChatMessage',
	z.object({
		id: z.number(),
		content: z.string(),
		is_own: z.boolean(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
);

export const chatSendMessageInputSchema = registry.register(
	'ChatSendMessageInput',
	z.object({
		content: z
			.string({ required_error: 'Message is empty.' })
			.min(1, 'Message is empty.')
			.max(500, 'You can only write up to 500 characters'),
	}),
);

export const chatSendMessageResponseSchema = registry.register(
	'ChatSendMessageResponse',
	z.object({
		chatId: z.number(),
	}),
);
