import { registry } from '@/lib/zodToOpenAPI';
import {
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';
import { commentSchema } from './engagement.schema';

export const likePostDocs = () => {
	registry.registerPath({
		tags: ['Engagement'],
		method: 'post',
		path: '/api/v1/post/like/{postId}',
		operationId: 'postLikePost',
		summary: 'Like User Posts',
		request: {
			params: z.object({
				postId: z.number(),
			}),
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

export const createPostCommentDocs = () => {
	registry.registerPath({
		tags: ['Engagement'],
		method: 'post',
		path: '/api/v1/post/comment/{postId}',
		operationId: 'postPostComment',
		summary: 'Comment To User Posts',
		request: {
			params: z.object({
				postId: z.number(),
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

export const getPostCommentsDocs = () => {
	registry.registerPath({
		tags: ['Engagement'],
		method: 'get',
		path: '/api/v1/post/comment/{postId}',
		operationId: 'getPostComments',
		summary: 'Get Post Comments',
		request: {
			params: z.object({
				postId: z.number(),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.array(commentSchema),
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
