import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';
import { userSchema } from '../user/user.schema';

export const friendSuggestionsDocs = () => {
	registry.registerPath({
		tags: ['Friends'],
		method: 'get',
		path: '/api/v1/suggestions',
		operationId: 'getFriendSuggestions',
		responses: {
			200: {
				description: 'OK',
				content: {
					'application/json': {
						schema: z.object({
							data: z.array(userSchema),
						}),
					},
				},
			},
		},
	});
};
