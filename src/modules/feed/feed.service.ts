import { db } from '@/db';
import { friendshipsTable } from '@/models/friendsTable';
import {
	postCommentTable,
	postImagesTable,
	postLikeTable,
	postTable,
} from '@/models/postTable';
import { bookmarkTable } from '@/models/bookmarkTable';
import { usersTable } from '@/models/usersTable';
import { aliasedTable, and, count, desc, eq, ne, or, sql } from 'drizzle-orm';

export const getFeedDiscoverPosts = async (
	userId: number,
	page: number,
	per_page: number,
) => {
	const postsCount = (
		await db
			.select({
				count: count(),
			})
			.from(postTable)
			.where(eq(postTable.audience, 'public'))
			.limit(1)
	)?.[0].count;

	const postLikeTable2 = aliasedTable(postLikeTable, 'pl2');

	const posts = await db
		.select({
			post: {
				...postTable,
				images: sql.raw(`
					json_agg(
						CASE
							WHEN post_images.image IS NOT NULL THEN
								jsonb_build_object(
									'image', post_images.image,
									'created_at', post_images.created_at,
									'updated_at', post_images.updated_at
								)
						END
					) FILTER (WHERE post_images.image IS NOT NULL) AS images
				  `),
				is_saved: sql.raw(
					'bool_or(bookmark.id IS NOT NULL) as is_saved',
				),
				is_liked: sql.raw(
					'bool_or(post_likes.id IS NOT NULL) as is_liked',
				),
				likes_count: sql.raw(
					`COUNT(DISTINCT pl2.id)::INTEGER AS new_likes_count`,
				),
				comments_count: sql.raw(
					`COUNT(DISTINCT post_comments.id)::INTEGER AS comments_count`,
				),
			},
			user: {
				...usersTable,
				// is_friend: sql.raw(
				// 	'bool_or(friendships.id IS NOT NULL) as is_saved',
				// ),
			},
		})
		.from(postTable)
		.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
		.leftJoin(postImagesTable, eq(postImagesTable.post_id, postTable.id))
		.leftJoin(
			bookmarkTable,
			and(
				eq(bookmarkTable.user_id, userId),
				eq(bookmarkTable.post_id, postTable.id),
			),
		)
		.leftJoin(
			postLikeTable,
			and(
				eq(postLikeTable.user_id, userId),
				eq(postTable.id, postLikeTable.post_id),
			),
		)
		.leftJoin(postLikeTable2, eq(postLikeTable2.post_id, postTable.id))
		.leftJoin(postCommentTable, eq(postCommentTable.post_id, postTable.id))
		.leftJoin(
			friendshipsTable,
			or(
				and(
					eq(friendshipsTable.user_id, postTable.user_id),
					eq(friendshipsTable.friend_id, userId),
				),
				and(
					eq(friendshipsTable.user_id, userId),
					eq(friendshipsTable.friend_id, postTable.user_id),
				),
			),
		)
		// .having(sql.raw(`bool_or(friendships.id IS NOT NULL)`))
		.where(eq(postTable.audience, 'public'))
		.groupBy(postTable.id, usersTable.id)
		.orderBy(desc(postTable.id))
		.limit(per_page)
		.offset((page - 1) * per_page);

	const itemsTaken = page * per_page;
	const remaining = postsCount - itemsTaken;

	return {
		posts,
		total: postsCount,
		remaining: Math.max(0, remaining),
	};
};

export const getFeedFriendsPosts = async (
	userId: number,
	page: number,
	per_page: number,
) => {
	const result = await db
		.select({
			post: {
				...postTable,
				images: sql.raw(
					`
						json_agg(
							CASE
								WHEN post_images.image IS NOT NULL THEN
									jsonb_build_object(
										'image', post_images.image,
										'created_at', post_images.created_at,
										'updated_at', post_images.updated_at
									)
							END
						) FILTER (WHERE post_images.image IS NOT NULL) AS images
      					`,
				),
				is_saved: sql.raw('bool_or(bookmark.id IS NOT NULL)'),
				is_liked: sql.raw('bool_or(post_likes.id IS NOT NULL)'),
			},
			user: usersTable,
		})
		.from(postTable)
		.where(ne(postTable.audience, 'private'))
		.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
		.innerJoin(
			friendshipsTable,
			or(
				eq(friendshipsTable.user_id, postTable.user_id),
				eq(friendshipsTable.friend_id, postTable.user_id),
			),
		)
		.leftJoin(postImagesTable, eq(postImagesTable.post_id, postTable.id))
		.leftJoin(
			bookmarkTable,
			and(
				eq(bookmarkTable.user_id, userId),
				eq(bookmarkTable.post_id, postTable.id),
			),
		)
		.leftJoin(
			postLikeTable,
			and(
				eq(postLikeTable.user_id, userId),
				eq(postTable.id, postLikeTable.post_id),
			),
		)
		.limit(per_page)
		.offset((page - 1) * per_page)
		.groupBy(postTable.id, usersTable.id)
		.orderBy(sql`RANDOM()`);

	return result;
};
