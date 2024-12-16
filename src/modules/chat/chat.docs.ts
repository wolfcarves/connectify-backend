import { registry } from '@/lib/zodToOpenAPI';
import {
	badRequestErrorResponse,
	forbiddenErrorResponse,
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';
import { z } from 'zod';
import {
	chatMessageSchema,
	chatSchema,
	chatSendMessageInputSchema,
	chatSendMessageResponseSchema,
} from './chat.schema';
import { paginationResponseSchema } from '@/schema/responseSchema';

export const createChatDocs = () => {
	registry.registerPath({
		tags: ['Chat'],
		method: 'post',
		path: '/api/v1/chats/create/{recipientId}',
		operationId: 'postCreateChat',
		summary: 'Create Chat',
		request: {
			params: z.object({
				recipientId: z.number().optional(),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.object({
								chat_id: z.number(),
							}),
						}),
					},
				},
			},
			...forbiddenErrorResponse,
			...badRequestErrorResponse,
			...unauthorizedErrorResponse,
			...notFoundErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const getChatsDocs = () => {
	registry.registerPath({
		tags: ['Chat'],
		method: 'get',
		path: '/api/v1/chats',
		operationId: 'getChats',
		summary: 'Get Chat List',
		request: {
			query: z.object({
				page: z.number().optional(),
				per_page: z.number().optional(),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.array(chatSchema),
							pagination: paginationResponseSchema,
						}),
					},
				},
			},
			...unauthorizedErrorResponse,
			...notFoundErrorResponse,
			...badRequestErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const getChatMessagesDocs = () => {
	registry.registerPath({
		tags: ['Chat'],
		method: 'get',
		path: '/api/v1/chats/{chatId}',
		operationId: 'getChatMessages',
		summary: 'Get Chat Messages',
		request: {
			params: z.object({
				chatId: z.number(),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.array(chatMessageSchema),
							pagination: paginationResponseSchema,
						}),
					},
				},
			},
			...unauthorizedErrorResponse,
			...notFoundErrorResponse,
			...badRequestErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const sendMessageDocs = () => {
	registry.registerPath({
		tags: ['Chat'],
		method: 'post',
		path: '/api/v1/chats/send/{chatId}',
		operationId: 'postChatSendMessage',
		summary: 'Send Chat Message',
		request: {
			params: z.object({
				chatId: z.number(),
			}),
			body: {
				content: {
					'application/json': {
						schema: chatSendMessageInputSchema,
					},
				},
				description: 'OK',
			},
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: chatSendMessageResponseSchema,
						}),
					},
				},
			},
			...unauthorizedErrorResponse,
			...validationErrorResponse,
			...notFoundErrorResponse,
			...badRequestErrorResponse,
			...serverErrorResponse,
		},
	});
};
