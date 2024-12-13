import { registry } from '@/lib/zodToOpenAPI';
import {
	badRequestErrorResponse,
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';
import { z } from 'zod';
import {
	chatSendMessageInputSchema,
	chatSendMessageResponseSchema,
	getChatsResponseSchema,
} from './chat.schema';
import { paginationResponseSchema } from '@/schema/responseSchema';

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
							data: getChatsResponseSchema,
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
		path: '/api/v1/chats/send',
		operationId: 'postChatSendMessage',
		summary: 'Send Chat Message',
		request: {
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
