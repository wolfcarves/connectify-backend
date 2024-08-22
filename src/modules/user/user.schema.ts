import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const userSchema = registry.register(
	'User',
	z.object({
		id: z.number(),
		avatar: z.string(),
		email: z.string().email(),
		name: z.string(),
		username: z.string(),
	}),
);

export type UserSchema = z.infer<typeof userSchema>;
