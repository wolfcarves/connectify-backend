import { registry } from '@/lib/zodToOpenAPI';
import {
	userLoginInputSchema,
	userSessionSchema,
	userSignUpInputSchema,
} from './auth.schema';
import { successResponseSchema } from '@/schema/responseSchema';
import {
	conflictErrorResponse,
	serverErrorResponse,
	unauthorizedErrorResponse,
	validationErrorResponse,
} from '@/helper/commonErrorResponse';

export const loginUserDocs = () => {
	registry.registerPath({
		tags: ['Authentication'],
		method: 'post',
		path: '/auth/login',
		operationId: 'postLoginUser',
		summary: 'Login User',
		request: {
			body: {
				content: {
					'application/json': { schema: userLoginInputSchema },
				},
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
			...unauthorizedErrorResponse,
			...conflictErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const signUpUserDocs = () => {
	registry.registerPath({
		tags: ['Authentication'],
		method: 'post',
		path: '/auth/signup',
		operationId: 'postSignUpUser',
		summary: 'Sign Up User',
		request: {
			body: {
				content: {
					'application/json': { schema: userSignUpInputSchema },
				},
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
			...validationErrorResponse,
			...conflictErrorResponse,
			...serverErrorResponse,
		},
	});
};

export const getCurrentSessionDocs = () => {
	registry.registerPath({
		tags: ['Authentication'],
		method: 'get',
		path: '/auth/session',
		operationId: 'getCurrentSession',
		summary: 'Get User Session',

		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: userSessionSchema,
					},
				},
			},
			...unauthorizedErrorResponse,
			...serverErrorResponse,
		},
	});
};
