import { registry } from '@/lib/zodToOpenAPI';
import {
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
} from '@/helper/commonErrorResponse';
import { paginationResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';
import { commentSchema } from './comment.schema';

export const createPostCommentDocs = () => {
	registry.registerPath({
		tags: ['Comment'],
		method: 'post',
		path: '/api/v1/comment/post/{postId}',
		operationId: 'postPostComment',
		summary: 'Comment To User Posts',
		request: {
			params: z.object({
				postId: z.number(),
				commentId: z.number(),
			}),
			body: {
				content: {
					'application/json': {
						schema: z.object({
							comment: z.string(),
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
						schema: z.object({
							data: z.object({
								id: z.number(),
							}),
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

export const getPostCommentsDocs = () => {
	registry.registerPath({
		tags: ['Comment'],
		method: 'get',
		path: '/api/v1/comment/post/{postId}',
		operationId: 'getPostComments',
		summary: 'Get Post Comments',
		request: {
			params: z.object({
				postId: z.number(),
			}),
			query: z.object({
				page: z.number().optional(),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.array(commentSchema),
							pagination: paginationResponseSchema,
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
