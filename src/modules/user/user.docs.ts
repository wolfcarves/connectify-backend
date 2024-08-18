import { registry } from '@/lib/zodToOpenAPI';
import {
	badRequestErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
import { userAvatarSchema } from './user.schema';
import { z } from 'zod';

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

export const getUserProfileImageDocs = () => {
	registry.registerPath({
		tags: ['User'],
		method: 'get',
		path: '/api/v1/user/profile/avatar',
		operationId: 'getUserProfileImage',
		summary: 'Get Profile Image',
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							success: z.boolean(),
							data: userAvatarSchema,
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
