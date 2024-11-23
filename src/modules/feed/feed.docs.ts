import { z } from 'zod';
import {
	notFoundErrorResponse,
	serverErrorResponse,
} from '@/helper/commonErrorResponse';
import { registry } from '@/lib/zodToOpenAPI';
import { postSchema } from '../post/post.schema';
import { userSchema } from '../user/user.schema';

export const getFeedWorldPosts = () => {
	registry.registerPath({
		tags: ['Feed'],
		method: 'get',
		path: '/api/v1/feed/posts/world',
		operationId: 'getFeedWorldPosts',
		summary: 'Get Feed World Posts',
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
			...serverErrorResponse,
		},
	});
};

export const getFeedFriendsPosts = () => {
	registry.registerPath({
		tags: ['Feed'],
		method: 'get',
		path: '/api/v1/feed/posts/friends',
		operationId: 'getFeedFriendsPosts',
		summary: 'Get Feed Friends Posts',
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
			...serverErrorResponse,
		},
	});
};
