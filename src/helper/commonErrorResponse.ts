import { userLoginResponseSchema } from '@/modules/auth/auth.schema';

export const commonErrorResponse = {
	500: {
		description: 'Server Internal Error.',
		content: {
			'application/json': {
				schema: userLoginResponseSchema,
			},
		},
	},
};
