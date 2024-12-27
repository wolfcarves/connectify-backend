import { z } from 'zod';
import {
	notFoundErrorResponse,
	serverErrorResponse,
} from '@/helper/commonErrorResponse';
import { registry } from '@/lib/zodToOpenAPI';
import { postSchema } from '../post/post.schema';
import { userSchema } from '../user/user.schema';
import { paginationResponseSchema } from '@/schema/responseSchema';

export const getFeedDiscoverPostsDocs = () => {
	registry.registerPath({
		tags: ['Feed'],
		method: 'get',
		path: '/api/v1/feed/posts/discover',
		operationId: 'getFeedDiscoverPosts',
		summary: 'Get Feed Discover Posts',
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
							pagination: paginationResponseSchema,
						}),
					},
				},
			},
			...notFoundErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const getFeedFriendsPostsDocs = () => {
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
