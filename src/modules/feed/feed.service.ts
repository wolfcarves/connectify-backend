import { db } from '@/db';
import { friendshipsTable } from '@/models/friendsTable';
import { postLikeTable, postTable } from '@/models/postTable';
import { usersTable } from '@/models/usersTable';
import { and, desc, eq, or, sql } from 'drizzle-orm';

export const getFeedWorldPosts = async (
	userId: number,
	page: number,
	perPage: number,
) => {
	const posts = await db
		.select()
		.from(postTable)
		.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
		.leftJoin(
			postLikeTable,
			and(
				eq(postLikeTable.user_id, userId),
				eq(postTable.id, postLikeTable.post_id),
			),
		)
		.orderBy(desc(postTable.created_at))
		.limit(perPage)
		.offset((page - 1) * perPage);

	const response = posts.map(p => {
		const isLiked = p.post_likes?.id ? true : false;

		const { user_id, ...restPost } = { ...p.post, isLiked };
		const { password, ...restUser } = p.user;

		return {
			post: restPost,
			user: restUser,
		};
	});

	return response;
};

export const getFeedFriendsPosts = async (
	userId: number,
	page: number,
	perPage: number,
) => {
	const posts = await db
		.select()
		.from(postTable)
		.innerJoin(usersTable, eq(postTable.user_id, usersTable.id))
		.innerJoin(
			friendshipsTable,
			or(
				eq(friendshipsTable.user_id, postTable.user_id),
				eq(friendshipsTable.friend_id, postTable.user_id),
			),
		)
		.leftJoin(
			postLikeTable,
			and(
				eq(postLikeTable.user_id, userId),
				eq(postTable.id, postLikeTable.post_id),
			),
		)
		.orderBy(sql.raw('RANDOM()'))
		.limit(perPage)
		.offset((page - 1) * perPage);

	const response = posts.map(p => {
		const isLiked = !!p.post_likes?.id;

		const { user_id, ...restPost } = { ...p.post, isLiked };
		const { password, ...restUser } = p.user;

		return {
			post: restPost,
			user: restUser,
		};
	});

	return response;
};
