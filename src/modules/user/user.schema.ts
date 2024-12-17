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
		friends_count: z.number(),
		is_friend: z.boolean(),
		has_request: z.boolean(),
		request_from: z.enum(['us', 'them']).nullish(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
);

export type UserSchema = z.infer<typeof userSchema>;

