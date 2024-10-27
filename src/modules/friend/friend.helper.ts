import { friendshipsTable } from '@/models/friendsTable';
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
