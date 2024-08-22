import { registry } from '@/lib/zodToOpenAPI';
import {
	badRequestErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { z } from 'zod';
import { userSchema } from './user.schema';

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
		path: '/api/v1/user/profile/{userId}',
		operationId: 'getUserProfile',
		summary: 'Get User Profile',
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
