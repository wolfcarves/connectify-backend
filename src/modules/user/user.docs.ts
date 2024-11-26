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
import { getUserProfileResponseSchema } from './user.schema';

export const uploadUserProfileImageDocs = () => {
	registry.registerPath({
		tags: ['User'],
		method: 'post',
		path: '/api/v1/user/profile/avatar',
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
		path: '/api/v1/user/profile/avatar',
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

export const getUserProfileDocs = () => {
	registry.registerPath({
		tags: ['User'],
		method: 'get',
		path: '/api/v1/user/profile',
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
						schema: getUserProfileResponseSchema,
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
