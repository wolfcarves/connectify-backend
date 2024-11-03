import { friendRequestsTable, friendshipsTable } from '@/models/friendsTable';
import { and, eq, or } from 'drizzle-orm';
import { db } from '@/db';

export const checkFriendStatus = async (userId: number, friendId: number) => {
	const is_friend = !!(
		await db
			.select()
			.from(friendshipsTable)
			.where(
				or(
					and(
						eq(friendshipsTable.user_id, userId),
						eq(friendshipsTable.friend_id, friendId),
					),
					and(
						eq(friendshipsTable.user_id, friendId),
						eq(friendshipsTable.friend_id, userId),
					),
				),
			)
	)?.[0];

	const hasrequest_fromUs = !!(
		await db
			.select()
			.from(friendRequestsTable)
			.where(
				and(
					eq(friendRequestsTable.sender_id, userId),
					eq(friendRequestsTable.receiver_id, friendId),
				),
			)
	)?.[0];

	const hasrequest_fromThem = !!(
		await db
			.select()
			.from(friendRequestsTable)
			.where(
				and(
					eq(friendRequestsTable.sender_id, friendId),
					eq(friendRequestsTable.receiver_id, userId),
				),
			)
	)?.[0];

	return {
		is_friend,
		has_request: is_friend
			? false
			: hasrequest_fromUs || hasrequest_fromThem,
		request_from: hasrequest_fromUs
			? 'us'
			: hasrequest_fromThem
				? 'them'
				: null,
	};
};
