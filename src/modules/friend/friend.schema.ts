import { z } from 'zod';
import { userSchema } from '../user/user.schema';
import { registry } from '@/lib/zodToOpenAPI';

export const friendSuggestionSchema = registry.register(
	'FriendSuggestion',
	userSchema
		.pick({
			id: true,
			avatar: true,
			name: true,
			username: true,
		})
		.extend({ status: z.enum(['accepted', 'pending']) }),
);

export const friendRequestSchema = registry.register(
	'FriendRequest',
	userSchema
		.pick({
			id: true,
			name: true,
			avatar: true,
			username: true,
		})
		.extend({
			userId: z.number(),
			status: z.enum(['accepted', 'pending']),
			created_at: z.string(),
		}),
);

export const friendSchema = registry.register(
	'Friend',
	userSchema
		.pick({
			id: true,
			avatar: true,
			name: true,
			username: true,
		})
		.extend({
			is_friend: z.boolean(),
			has_request: z.boolean(),
			request_from: z.enum(['us', 'them']),
		}),
);
