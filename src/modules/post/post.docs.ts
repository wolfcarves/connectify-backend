import { registry } from '@/lib/zodToOpenAPI';
import { createPostInputSchema, postSchema } from './post.schema';
import {
	conflictErrorResponse,
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';
import { userSchema } from '../user/user.schema';

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
		path: '/api/v1/post/{uuid}',
		operationId: 'getUserPost',
		summary: 'Get User Post',
		request: {
			params: z.object({
				uuid: z.string().openapi({
					example: '8c5aa382-76c2-4aee-bab8-95e79806f262',
				}),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.object({
								post: postSchema,
								user: userSchema,
							}),
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
		path: '/api/v1/post/all/{username}',
		operationId: 'getUserPosts',
		summary: 'Get User Posts',
		request: {
			params: z.object({
				username: z.string(),
			}),
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
							data: z.array(
								z.object({
									post: postSchema,
									user: userSchema,
								}),
							),
						}),
					},
				},
			},
			...notFoundErrorResponse,
			...unauthorizedErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const deleteUserPostDocs = () => {
	registry.registerPath({
		tags: ['Post'],
		method: 'delete',
		path: '/api/v1/post/{postId}',
		operationId: 'deleteUserPost',
		summary: 'Get User Posts',
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
							data: z.object({
								post: postSchema,
								user: userSchema,
							}),
						}),
					},
				},
			},
			...notFoundErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const saveUserPostDocs = () => {
	registry.registerPath({
		tags: ['Post'],
		method: 'post',
		path: '/api/v1/post/save/{postId}',
		operationId: 'saveUserPost',
		summary: 'Save User Post',
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
			...notFoundErrorResponse,
			...conflictErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const unSaveUserPostDocs = () => {
	registry.registerPath({
		tags: ['Post'],
		method: 'post',
		path: '/api/v1/post/unsave/{postId}',
		operationId: 'unSaveUserPost',
		summary: 'Unsave User Post',
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
			...notFoundErrorResponse,
			...serverErrorResponse,
		},
	});
};
