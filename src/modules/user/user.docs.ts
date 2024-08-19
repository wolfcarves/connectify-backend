import { registry } from '@/lib/zodToOpenAPI';
import {
	badRequestErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';
import { successResponseSchema } from '@/schema/responseSchema';
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
