import { userLoginResponseSchema } from '@/modules/auth/auth.schema.ts';

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
