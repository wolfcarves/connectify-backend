import { z } from 'zod';
import { registry } from '@/utils/zodToOpenAPI.ts';

export const userSchema = registry.register(
	'Object',
	z
		.object({
			email: z.string().email().openapi('email'),
			username: z.string().openapi('username'),
			password: z.string().openapi('password'),
		})
		.openapi('Object'),
);

export type UserSchema = z.infer<typeof userSchema>;
