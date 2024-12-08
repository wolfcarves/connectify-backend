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
		path: '/api/v1/comment',
		operationId: 'postPostComment',
		summary: 'Comment To User Posts',
		request: {
			query: z.object({
				postId: z.number().optional(),
				commentId: z.number().optional(),
			}),
			body: {
				content: {
					'application/json': {
						schema: z.object({
							content: z.string(),
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
		path: '/api/v1/comment',
		operationId: 'getPostComments',
		summary: 'Get Post Comments',
		request: {
			query: z.object({
				postId: z.number(),
				commentId: z.number().optional(),
				page: z.number().optional(),
				perPage: z.number().optional(),
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
