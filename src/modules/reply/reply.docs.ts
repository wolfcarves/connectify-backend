import { registry } from '@/lib/zodToOpenAPI';
import {
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';
import { replySchema } from './reply.schema';

export const createPostReplyDocs = () => {
	registry.registerPath({
		tags: ['Reply'],
		method: 'post',
		path: '/api/v1/reply/comment/{commentId}',
		operationId: 'postPostReply',
		summary: 'Reply To User Comment',
		request: {
			params: z.object({
				commentId: z.number(),
			}),
			body: {
				content: {
					'application/json': {
						schema: z.object({
							reply: z.string(),
						}),
					},
				},
			},
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: successResponseSchema,
					},
				},
			},
			...unauthorizedErrorResponse,
			...notFoundErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const getCommentRepliesDocs = () => {
	registry.registerPath({
		tags: ['Reply'],
		method: 'get',
		path: '/api/v1/reply/comment/{commentId}',
		operationId: 'getCommentReplies',
		summary: 'Get Comment Replies',
		request: {
			params: z.object({
				commentId: z.number(),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.array(replySchema),
						}),
					},
				},
			},
			...unauthorizedErrorResponse,
			...notFoundErrorResponse,
			...serverErrorResponse,
		},
	});
};
