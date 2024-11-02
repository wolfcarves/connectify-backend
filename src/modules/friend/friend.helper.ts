import { friendRequestsTable, friendshipsTable } from '@/models/friendsTable';
import { and, eq, or } from 'drizzle-orm';
import { db } from '@/db';

export const checkIfFriend = async (userId: number, friendId: number) => {
	const isFriend = !!(
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

	return isFriend;
};

export const checkIfHasFriendRequest = async (
	userId: number,
	friendId: number,
	isFriend: boolean,
) => {
	const hasRequestFromUs = !!(
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

	const hasRequestFromThem = !!(
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
		hasRequest: isFriend ? false : hasRequestFromUs || hasRequestFromThem,
		requestFrom: hasRequestFromUs
			? 'us'
			: hasRequestFromThem
				? 'them'
				: null,
	};
};
