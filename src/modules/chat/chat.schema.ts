import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';

export const chatSchema = registry.register(
	'Chat',
	z.object({
		id: z.number(),
		user_id: z.number(),
		avatar: z.string(),
		name: z.string(),
		latest_message: z.string(),
		latest_message_at: z.string(),
		is_read: z.boolean(),
	}),
);

export const chatMessageSchema = registry.register(
	'ChatMessage',
	z.object({
		id: z.number(),
		sender_id: z.number(),
		chat_id: z.number(),
		content: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
);

export type ChatMessage = z.infer<typeof chatMessageSchema>;

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
		messageId: z.number(),
	}),
);
