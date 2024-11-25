import { registry } from '@/lib/zodToOpenAPI';
import { z } from 'zod';

export const bookmarkSchema = registry.register(
	'Bookmark',
	z.object({
		id: z.number(),
		post_id: z.number(),
		post_uuid: z.number(),
		author_name: z.string(),
		author_username: z.string(),
		author_image: z.string(),
		content: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
);
