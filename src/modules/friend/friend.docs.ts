import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';
import { successResponseSchema } from '@/schema/responseSchema';
import {
	badRequestErrorResponse,
	notFoundErrorResponse,
	serverErrorResponse,
} from '@/helper/commonErrorResponse';
import {
	getFriendListResponseSchema,
	getFriendRequestResponseSchema,
	getFriendSuggestionsResponseSchema,
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
						schema: getFriendSuggestionsResponseSchema,
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
		path: '/api/v1/friends/request/send/{receiverId}',
		operationId: 'sendFriendRequest',
		request: {
			params: z.object({
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

export const cancelFriendRequestDocs = () => {
	registry.registerPath({
		tags: ['Friends'],
		method: 'delete',
		path: '/api/v1/friends/request/cancel/{requesterId}',
		operationId: 'cancelFriendRequest',
		request: {
			params: z.object({
				requesterId: z.string(),
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
			...badRequestErrorResponse,
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
