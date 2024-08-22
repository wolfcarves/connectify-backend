import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';
import { userSchema } from '../user/user.schema';

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

export const userSignUpInputSchema = registry.register(
	'UserSignUpInput',
	userSchema
		.extend({
			password: z.string(),
			confirm_password: z.string(),
		})
		.omit({ avatar: true })
		.refine(data => data.password === data.confirm_password, {
			message: "Password didn't matched",
			path: ['password', 'confirm_password'],
		}),
);

export type UserSignUpInput = z.infer<typeof userSignUpInputSchema>;

export const userSessionSchema = registry.register(
	'Session',
	z.object({
		data: userSchema.extend({ id: z.number() }),
	}),
);
