import { z } from 'zod';
import { registry } from '@/lib/zodToOpenAPI';

export const postCommentSchema = registry.register(
	'PostComment',
	z.object({
		comment: z.string().min(1, 'Comment should not be empty'),
	}),
);
