import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';
import { userSchema } from '../user/user.schema';
import { successResponseSchema } from '@/schema/responseSchema';
import {
	notFoundErrorResponse,
	serverErrorResponse,
} from '@/helper/commonErrorResponse';
import {
	getFriendListResponseSchema,
	getFriendRequestResponseSchema,
} from './friend.schema';

export const friendSuggestionsDocs = () => {
	registry.registerPath({
		tags: ['Friends'],
		method: 'get',
		path: '/api/v1/friends/suggestions',
		operationId: 'getFriendSuggestions',
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.array(userSchema),
						}),
					},
				},
			},

			...serverErrorResponse,
		},
	});
};

export const sendFriendRequestDocs = () => {
	registry.registerPath({
		tags: ['Friends'],
		method: 'post',
		path: '/api/v1/friends/request/send',
		operationId: 'sendFriendRequest',
		request: {
			query: z.object({
				receiverId: z.string(),
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

export const getFriendRequestsDocs = () => {
	registry.registerPath({
		tags: ['Friends'],
		method: 'get',
		path: '/api/v1/friends/requests',
		operationId: 'getFriendRequests',
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: getFriendRequestResponseSchema,
					},
				},
			},
			...serverErrorResponse,
		},
	});
};

export const acceptFriendRequestDocs = () => {
	registry.registerPath({
		tags: ['Friends'],
		method: 'post',
		path: '/api/v1/friends/request/accept/{friendId}',
		operationId: 'acceptFriendRequest',
		request: {
			params: z.object({
				friendId: z.string(),
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

export const getFriendListDocs = () => {
	registry.registerPath({
		tags: ['Friends'],
		method: 'get',
		path: '/api/v1/friends/list',
		operationId: 'getFriendList',
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: getFriendListResponseSchema,
					},
				},
			},
		},
	});
};

export const unfriendUserDocs = () => {
	registry.registerPath({
		tags: ['Friends'],
		method: 'delete',
		path: '/api/v1/friends/remove/{friendId}',
		operationId: 'unfriendUser',
		request: {
			params: z.object({
				friendId: z.string(),
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
		},
	});
};
