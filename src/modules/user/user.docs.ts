import { registry } from '@/lib/zodToOpenAPI';
import {
	badRequestErrorResponse,
	notFoundErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';
import { userSchema } from './user.schema';

export const getUserProfileDocs = () => {
	registry.registerPath({
		tags: ['User'],
		method: 'get',
		path: '/api/v1/users/profile',
		operationId: 'getUserProfile',
		summary: 'Get User Profile',
		request: {
			query: z.object({
				userId: z.number().optional(),
				username: z.string().optional(),
			}),
		},
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: userSchema,
						}),
					},
				},
			},
			...badRequestErrorResponse,
			...validationErrorResponse,
			...unauthorizedErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const getUsersDocs = () => {
	registry.registerPath({
		tags: ['User'],
		method: 'get',
		path: '/api/v1/users',
		operationId: 'getUsers',
		summary: 'Get Users',
		request: {
			query: z.object({
				search: z.string().optional(),
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
							data: z.array(userSchema),
						}),
					},
				},
			},
			...badRequestErrorResponse,
			...validationErrorResponse,
			...unauthorizedErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const uploadUserProfileImageDocs = () => {
	registry.registerPath({
		tags: ['User'],
		method: 'post',
		path: '/api/v1/users/profile/avatar',
		operationId: 'postUploadUserProfileImage',
		summary: 'Upload Profile Image',
		request: {
			body: {
				content: {
					'multipart/form-data': {
						schema: z.object({
							avatar: z.any(),
						}),
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

			...badRequestErrorResponse,
			...notFoundErrorResponse,
			...validationErrorResponse,
			...unauthorizedErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const deleteUserProfileImageDocs = () => {
	registry.registerPath({
		tags: ['User'],
		method: 'delete',
		path: '/api/v1/users/profile/avatar',
		operationId: 'deleteUserProfileImage',
		summary: 'Delete Profile Image',
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
			...validationErrorResponse,
			...unauthorizedErrorResponse,
			...serverErrorResponse,
		},
	});
};
