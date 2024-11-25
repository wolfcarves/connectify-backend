import { db } from '@/db';
import { bookmarkTable } from '@/models/bookmarkTable';
import { postTable } from '@/models/postTable';
import { and, desc, eq } from 'drizzle-orm';
import { checkPostExistence, isPostSaved } from '../post/post.helper';
import { usersTable } from '@/models/usersTable';

export const getBookmarks = async (
	userId: number,
	page: number,
	per_page: number,
) => {
	const bookmarks = await db
		.select({
			id: bookmarkTable.id,
			post_id: postTable.id,
			post_uuid: postTable.uuid,
			author_username: usersTable.username,
			author_image: usersTable.avatar,
			author_name: usersTable.name,
			content: postTable.content,
			created_at: bookmarkTable.created_at,
			updated_at: bookmarkTable.updated_at,
		})
		.from(bookmarkTable)
		.innerJoin(
			postTable,
			and(
				eq(bookmarkTable.post_id, postTable.id),
				eq(postTable.audience, 'public'),
				eq(bookmarkTable.user_id, userId),
			),
		)
		.innerJoin(usersTable, eq(usersTable.id, postTable.user_id))
		.where(eq(bookmarkTable.user_id, userId))
		.orderBy(desc(bookmarkTable.created_at))
		.limit(per_page)
		.offset((page - 1) * per_page);

	return bookmarks;
};

export const savePost = async (userId: number, postId: number) => {
	const isPostExists = await checkPostExistence(postId);
	const isSaved = await isPostSaved(userId, postId);

	if (isSaved || !isPostExists) return false;

	await db.insert(bookmarkTable).values({
		user_id: userId,
		post_id: postId,
	});

	return true;
};

export const unSavePost = async (userId: number, postId: number) => {
	const isPostExists = await checkPostExistence(postId);
	const isNotSaved = !(await isPostSaved(userId, postId));

	if (isNotSaved || !isPostExists) return false;

	await db
		.delete(bookmarkTable)
		.where(
			and(
				eq(bookmarkTable.user_id, userId),
				eq(bookmarkTable.post_id, postId),
			),
		);

	return true;
};
