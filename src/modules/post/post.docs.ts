import { registry } from '@/lib/zodToOpenAPI';
import { createPostInputSchema, postSchema } from './post.schema';
import {
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';

export const createPostDocs = () => {
	registry.registerPath({
		tags: ['Post'],
		method: 'post',
		path: '/api/v1/post',
		operationId: 'postCreatePost',
		summary: 'Create Post',
		request: {
			body: {
				content: {
					'application/json': {
						schema: createPostInputSchema,
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
						schema: successResponseSchema,
					},
				},
			},
			...validationErrorResponse,
			...unauthorizedErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const getUserPostDocs = () => {
	registry.registerPath({
		tags: ['Post'],
		method: 'get',
		path: '/api/v1/post/{postId}',
		operationId: 'getUserPost',
		summary: 'Get User Post',
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
							data: postSchema,
						}),
					},
				},
			},
			...notFoundErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const getUserPostsDocs = () => {
	registry.registerPath({
		tags: ['Post'],
		method: 'get',
		path: '/api/v1/post/all/{userId}',
		operationId: 'getUserPosts',
		summary: 'Get User Posts',
		request: {
			params: z.object({
				userId: z.number(),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.array(
							z.object({
								data: postSchema,
							}),
						),
					},
				},
			},
			...notFoundErrorResponse,
			...serverErrorResponse,
		},
	});
};
