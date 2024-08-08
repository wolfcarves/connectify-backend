import { registry } from '@/lib/zodToOpenAPI';
import {
	userLoginInputSchema,
	userLoginResponseSchema,
	userSignupInputSchema,
} from './auth.schema';
import { commonErrorResponse } from '@/helper/commonErrorResponse';

export const loginUserDocs = () => {
	registry.registerPath({
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
			...commonErrorResponse,
		},
	});
};

export const signUpUserDocs = () => {
	registry.registerPath({
		method: 'post',
		path: '/signup',
		summary: 'Sign Up User',
		request: {
			body: {
				content: {
					'application/json': { schema: userSignupInputSchema },
				},
			},
		},
		responses: {
			200: {
				description: 'Signup successfully.',
			},
			...commonErrorResponse,
		},
	});
};
