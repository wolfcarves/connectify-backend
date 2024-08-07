import { z } from 'zod';
import { registry } from '@/utils/zodToOpenAPI.ts';
import { userSchema } from '../user/user.model.ts';

export const userLoginInput = registry.register(
	'Object',
	z.object({
		username: z.string().min(1, 'Please enter your username').max(100, 'Invalid username or password'),
		password: z
			.string()
			.min(1, 'Please enter your username')
			.min(1, 'Please enter your username')
			.max(100, 'Invalid username or password'),
	}),
);

export const userSignupInput = registry.register(
	'Object',
	userSchema
		.extend({
			confirm_password: z.string().openapi('confirm_password'),
		})
		.refine(data => data.password === data.confirm_password, {
			message: "Password didn't matched",
			path: ['password', 'confirm_password'],
		})
		.openapi('UserSignupInput'),
);

export type UserSignupInput = z.infer<typeof userSignupInput>;
