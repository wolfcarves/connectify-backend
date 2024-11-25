import { registry } from '@/lib/zodToOpenAPI';
import {
	conflictErrorResponse,
	notFoundErrorResponse,
	serverErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';
import { bookmarkSchema } from './bookmark.schema';

export const getBookmarksDocs = () => {
	registry.registerPath({
		tags: ['Bookmark'],
		method: 'get',
		path: '/api/v1/bookmark/posts',
		operationId: 'getBookmarks',
		summary: 'Get Save Posts | Get Bookmarks',
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
							data: z.array(bookmarkSchema),
						}),
					},
				},
			},
			...notFoundErrorResponse,
			...conflictErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const saveUserPostDocs = () => {
	registry.registerPath({
		tags: ['Bookmark'],
		method: 'post',
		path: '/api/v1/bookmark/post/save/{postId}',
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
		tags: ['Bookmark'],
		method: 'post',
		path: '/api/v1/bookmark/post/unsave/{postId}',
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
