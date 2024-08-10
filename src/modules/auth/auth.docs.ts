import { registry } from '@/lib/zodToOpenAPI';
import {
	userLoginInputSchema,
	userLoginResponseSchema,
	userSignUpInputSchema,
	userSignUpResponseSchema,
} from './auth.schema';
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
		path: '/login',
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
				description: 'Login successfully.',
				content: {
					'application/json': {
						schema: userLoginResponseSchema,
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
		path: '/signup',
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
				description: 'Signup successfully.',
				content: {
					'application/json': {
						schema: userSignUpResponseSchema,
					},
				},
			},
			...validationErrorResponse,
			...conflictErrorResponse,
			...serverErrorResponse,
		},
	});
};
