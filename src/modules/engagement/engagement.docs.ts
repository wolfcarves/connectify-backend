import { registry } from '@/lib/zodToOpenAPI';
import {
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';

export const likePostDocs = () => {
	registry.registerPath({
		tags: ['Post'],
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
		tags: ['Post'],
		method: 'post',
		path: '/api/v1/post/comment/{postId}',
		operationId: 'postPostComment',
		summary: 'Comment To User Posts',
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
