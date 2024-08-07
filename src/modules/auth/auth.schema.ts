import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI.ts';
import { userSchema } from '../user/user.schema.ts';

export const userLoginInputSchema = registry.register(
	'UserLoginInput',
	z.object({
		username: z
			.string()
			.min(1, 'Please enter your username')
			.max(100, 'Invalid username or password'),
		password: z
			.string()
			.min(1, 'Please enter your username')
			.min(1, 'Please enter your username')
			.max(100, 'Invalid username or password'),
	}),
);

export const userLoginResponseSchema = registry.register(
	'UserLoginResponse',
	z.object({
		message: z.string(),
	}),
);

export const userSignupInputSchema = registry.register(
	'UserSignUpInput',
	userSchema
		.extend({
			confirm_password: z.string(),
		})
		.refine(data => data.password === data.confirm_password, {
			message: "Password didn't matched",
			path: ['password', 'confirm_password'],
		}),
);

export type UserSignupInput = z.infer<typeof userSignupInputSchema>;
