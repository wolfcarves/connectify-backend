import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';

export const chatSchema = registry.register(
	'Chat',
	z.object({
		id: z.number(),
		username: z.string(),
		name: z.string(),
		message: z.string(),
		roomId: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
);

export const getChatsResponseSchema = registry.register(
	'Chats',
	z.array(chatSchema),
);

export const chatSendMessageInputSchema = registry.register(
	'ChatSendMessageInput',
	z.object({
		recipientId: z.number(),
		message: z
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
