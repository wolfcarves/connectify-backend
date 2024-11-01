import { z } from 'zod';
import { userSchema } from '../user/user.schema';

export const getFriendSuggestionsResponseSchema = z.object({
	data: z.array(
		userSchema
			.pick({
				id: true,
				avatar: true,
				name: true,
				username: true,
			})
			.extend({ status: z.enum(['accepted', 'pending']) }),
	),
});

export const getFriendRequestResponseSchema = z.object({
	data: z.object({
		id: z.number(),
		user: userSchema.pick({
			id: true,
			name: true,
			avatar: true,
		}),
		created_at: z.string(),
		status: z.enum(['accepted', 'pending']),
	}),
});

export const getFriendListResponseSchema = z.object({
	data: z.object({
		id: z.number(),
		user: userSchema.pick({
			id: true,
			name: true,
			avatar: true,
		}),
		created_at: z.string(),
	}),
});
