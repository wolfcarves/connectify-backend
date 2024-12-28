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
		tags: ['Like'],
		method: 'post',
		path: '/api/v1/like/post/{postId}',
		operationId: 'postLikePost',
		summary: 'Like User Post',
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

export const likeCommentDocs = () => {
	registry.registerPath({
		tags: ['Like'],
		method: 'post',
		path: '/api/v1/like/comment/{commentId}',
		operationId: 'postLikeComment',
		summary: 'Like User Comment',
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
