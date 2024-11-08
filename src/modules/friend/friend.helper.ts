import { friendRequestsTable, friendshipsTable } from '@/models/friendsTable';
import { and, eq, or, sql, type SQL } from 'drizzle-orm';
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
		is_friend,
		has_request: is_friend ? false : hasRequestFromUs || hasRequestFromThem,
		request_from: hasRequestFromUs
			? 'us'
			: hasRequestFromThem
				? 'them'
				: null,
	};
};

/* FRIEND SUGGESTIONS */

export const applySameCityQuery = (
	query: SQL<unknown>,
	city?: string | null,
) => {
	if (city) {
		query.append(
			sql.raw(`
				ORDER BY
					CASE 
						WHEN u.city = '${city}' THEN 1 
						ELSE 2 
					END,
					u.id
					DESC
				LIMIT 50;
					
		`),
		);
	}
};
