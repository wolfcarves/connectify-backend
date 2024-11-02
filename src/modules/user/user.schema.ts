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
		created_at: z.string(),
		updated_at: z.string(),
	}),
);

export type UserSchema = z.infer<typeof userSchema>;

export const getUserProfileResponseSchema = registry.register(
	'GetuserProfileResponseSchema',
	z.object({
		data: userSchema.extend({
			isFriend: z.boolean(),
			hasRequest: z.boolean(),
			requestFrom: z.enum(['us', 'them']).nullish(),
		}),
	}),
);
