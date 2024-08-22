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
		path: '/api/v1/auth/login',
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
		path: '/api/v1/auth/signup',
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
		path: '/api/v1/auth/session',
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

export const deleteSessionDocs = () => {
	registry.registerPath({
		tags: ['Authentication'],
		method: 'delete',
		path: '/api/v1/auth/session',
		operationId: 'deleteCurrentSession',
		summary: 'Delete Current Session',
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
