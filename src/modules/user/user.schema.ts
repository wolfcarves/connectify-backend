import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const userSchema = registry.register(
	'User',
	z.object({
		email: z.string().email(),
		uuid: z.string(),
		name: z.string(),
		username: z.string(),
		password: z.string(),
		avatar: z.string(),
	}),
);

export type UserSchema = z.infer<typeof userSchema>;

export const userAvatarSchema = registry.register(
	'UserAvatar',
	z.object({
		avatar: z.string(),
		id: z.number(),
		user_id: z.number(),
	}),
);
