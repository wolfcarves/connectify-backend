import { db } from '@/db';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { friendRequestsTable, friendshipsTable } from '@/models/friendsTable';
import { usersTable } from '@/models/usersTable';
import { and, desc, eq, ne, notExists, or } from 'drizzle-orm';
import { type PostgresError } from 'postgres';
import { checkIfFriend } from './friend.helper';

export const getFriendsSuggestions = async (
	userId: number,
	latestUserId: number,
) => {
	let id = 0;

	if (!latestUserId) {
		id = (
			await db.select().from(usersTable).orderBy(desc(usersTable.id))
		)?.[0].id;
	}

	const limit = 30;
	const friendRequestOffset = id < limit ? 0 : id;

	const suggestedFriends = await db
		.select({
			id: usersTable.id,
			avatar: usersTable.avatar,
			name: usersTable.name,
			username: usersTable.username,
			status: friendRequestsTable.status,
		})
		.from(usersTable)
		.leftJoin(
			friendRequestsTable,
			and(
				eq(friendRequestsTable.sender_id, userId),
				eq(friendRequestsTable.receiver_id, usersTable.id),
			),
		)
		.where(
			and(
				ne(usersTable.id, userId),
				notExists(
					db
						.select()
						.from(friendRequestsTable)
						.where(
							eq(friendRequestsTable.sender_id, usersTable.id),
						),
				),
				notExists(
					db
						.select()
						.from(friendshipsTable)
						.where(
							or(
								and(
									eq(friendshipsTable.user_id, userId),
									eq(
										friendshipsTable.friend_id,
										usersTable.id,
									),
								),
								and(
									eq(friendshipsTable.user_id, usersTable.id),
									eq(friendshipsTable.friend_id, userId),
								),
							),
						),
				),
			),
		)
		.offset(friendRequestOffset)
		.limit(limit);

	return {
		suggestedFriends,
		friendRequestOffset,
	};
};

export const createFriendRequest = async (
	senderId: number,
	receiverId: number,
) => {
	if (!senderId || !receiverId) {
		throw new NotFoundException('User not found');
	}

	if (senderId === Number(receiverId))
		throw new BadRequestException('You cannot add yourself');

	try {
		const isFriend = await checkIfFriend(senderId, receiverId);

		if (isFriend)
			throw new BadRequestException('This user is already user friend');

		const response = await db.insert(friendRequestsTable).values({
			sender_id: senderId,
			receiver_id: receiverId,
		});

		return response;
	} catch (error) {
		const err = error as PostgresError;

		// No user
		if (err.code === '23503') throw new NotFoundException('User not found');

		// Request exists
		if (err.code === '23505')
			throw new BadRequestException('Friend request already sent');

		throw err;
	}
};

export const deleteFriendRequest = async (
	userId: number,
	requesterId: number,
) => {
	if (!userId || !requesterId) {
		throw new NotFoundException('User not found');
	}

	if (userId === Number(requesterId))
		throw new BadRequestException('You cannot unfriend yourself');

	const response = (
		await db
			.delete(friendRequestsTable)
			.where(
				or(
					and(
						eq(friendRequestsTable.sender_id, userId),
						eq(friendRequestsTable.receiver_id, requesterId),
					),
					and(
						eq(friendRequestsTable.sender_id, requesterId),
						eq(friendRequestsTable.receiver_id, userId),
					),
				),
			)
			.returning({ id: friendRequestsTable.sender_id })
	)[0];

	if (!response) throw new BadRequestException('Nothing to delete');

	return response;
};

export const getFriendRequests = async (userId: number) => {
	const friendRequest = await db
		.select({
			id: friendRequestsTable.id,
			user: {
				id: usersTable.id,
				avatar: usersTable.avatar,
				name: usersTable.name,
				username: usersTable.username,
			},
			status: friendRequestsTable.status,
		})
		.from(friendRequestsTable)
		.where(
			and(
				eq(friendRequestsTable.receiver_id, userId),
				eq(friendRequestsTable.status, 'pending'),
			),
		)
		.innerJoin(
			usersTable,
			eq(usersTable.id, friendRequestsTable.sender_id),
		);

	return friendRequest;
};

export const acceptFriendRequest = async (userId: number, friendId: number) => {
	try {
		const isFriend = await checkIfFriend(userId, friendId);

		if (isFriend) throw new NotFoundException('No user to accept');

		await db
			.update(friendRequestsTable)
			.set({
				status: 'accepted',
			})
			.where(
				and(
					eq(friendRequestsTable.sender_id, friendId),
					eq(friendRequestsTable.receiver_id, userId),
					eq(friendRequestsTable.status, 'pending'),
				),
			);

		await db.insert(friendshipsTable).values({
			user_id: userId,
			friend_id: friendId,
		});
	} catch (error) {
		throw new NotFoundException('No user to accept');
	}
};

export const getFriendList = async (userId: number) => {
	const friendList = await db
		.select({
			id: friendshipsTable.id,
			user: {
				id: usersTable.id,
				name: usersTable.avatar,
				avatar: usersTable.avatar,
				created_at: usersTable.created_at,
			},
		})
		.from(friendshipsTable)
		.where(eq(friendshipsTable.user_id, userId))
		.innerJoin(usersTable, eq(friendshipsTable.user_id, usersTable.id));

	return friendList;
};

export const unfriendUser = async (userId: number, friendId: number) => {
	const response = (
		await db
			.delete(friendshipsTable)
			.where(
				or(
					eq(friendshipsTable.user_id, userId),
					eq(friendshipsTable.friend_id, friendId),
				),
			)
			.returning({ userId: friendshipsTable.id })
	)[0];

	if (!response) throw new NotFoundException('No user to unfriend');

	return response;
};
