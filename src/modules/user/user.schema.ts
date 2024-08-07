import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI.ts';

export const userSchema = registry.register(
	'User',
	z.object({
		email: z.string().email(),
		username: z.string(),
		password: z.string(),
	}),
);

export type UserSchema = z.infer<typeof userSchema>;
