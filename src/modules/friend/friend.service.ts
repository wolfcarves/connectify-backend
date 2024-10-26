/* eslint-disable @typescript-eslint/no-unused-vars */

import { db } from '@/db';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { friendsTable } from '@/models/friendsTable';
import { usersTable } from '@/models/usersTable';
import { and, eq, or } from 'drizzle-orm';

export const sendFriendRequest = async (
	senderId: number,
	receiverId: number,
) => {
	if (!senderId || !receiverId) throw new NotFoundException('User not found');

	if (senderId === Number(receiverId))
		throw new BadRequestException('You not add yourself');

	const requestExists = (await getFriendList(receiverId))[0];

	if (requestExists)
		throw new BadRequestException('User already sent you a request');

	const isRequestSent = (
		await db
			.select()
			.from(friendsTable)
			.where(
				or(
					and(
						eq(friendsTable.user_id, senderId),
						eq(friendsTable.friend_id, receiverId),
						eq(friendsTable.is_accepted, false),
					),
					and(
						eq(friendsTable.user_id, receiverId),
						eq(friendsTable.friend_id, senderId),
						eq(friendsTable.is_accepted, false),
					),
				),
			)
	)[0];

	if (isRequestSent) {
		await db
			.delete(friendsTable)
			.where(
				and(
					eq(friendsTable.user_id, senderId),
					eq(friendsTable.friend_id, receiverId),
					eq(friendsTable.is_accepted, false),
				),
			);

		return {
			message: 'Withdrew Request',
		};
	}

	try {
		await db.insert(friendsTable).values({
			user_id: senderId,
			friend_id: receiverId,
		});
	} catch (error) {
		throw new NotFoundException('User not found');
	}

	return {
		message: 'Friend Request Sent!',
	};
};

export const getFriendRequests = async (userId: number) => {
	const friendRequest = await db
		.select({
			id: friendsTable.id,
			user: {
				id: usersTable.id,
				avatar: usersTable.avatar,
				name: usersTable.name,
			},
			is_accepted: friendsTable.is_accepted,
		})
		.from(friendsTable)
		.where(
			and(
				eq(friendsTable.friend_id, userId),
				eq(friendsTable.is_accepted, false),
			),
		)
		.innerJoin(usersTable, eq(usersTable.id, friendsTable.user_id));

	return friendRequest;
};

export const acceptFriendRequest = async (userId: number, friendId: number) => {
	const isAccepted = (
		await db
			.select()
			.from(friendsTable)
			.where(
				and(
					eq(friendsTable.user_id, friendId),
					eq(friendsTable.friend_id, userId),
					eq(friendsTable.is_accepted, true),
				),
			)
	)[0];

	const isExists = (
		await db
			.select()
			.from(friendsTable)
			.where(
				and(
					eq(friendsTable.user_id, friendId),
					eq(friendsTable.friend_id, userId),
				),
			)
	)[0]?.id;

	if (isAccepted)
		throw new BadRequestException('User is already your friend');

	if (!isExists) {
		throw new NotFoundException('User not found');
	}

	await db
		.update(friendsTable)
		.set({
			is_accepted: true,
		})
		.where(
			and(
				eq(friendsTable.user_id, friendId),
				eq(friendsTable.friend_id, userId),
				eq(friendsTable.is_accepted, false),
			),
		);

	return false;
};

export const getFriendList = async (userId: number) => {
	const response = await db
		.select()
		.from(friendsTable)
		.where(
			or(
				eq(friendsTable.user_id, userId),
				eq(friendsTable.friend_id, userId),
				eq(friendsTable.is_accepted, true),
			),
		);

	return response;
};

export const unfriendUser = async (userId: number, friendId: number) => {
	const response = (
		await db
			.select()
			.from(friendsTable)
			.where(
				or(
					and(
						eq(friendsTable.user_id, userId),
						eq(friendsTable.friend_id, friendId),
						eq(friendsTable.is_accepted, true),
					),
					and(
						eq(friendsTable.user_id, friendId),
						eq(friendsTable.friend_id, userId),
						eq(friendsTable.is_accepted, true),
					),
				),
			)
	)[0];

	if (!response) throw new NotFoundException('User not found');

	await db
		.delete(friendsTable)
		.where(
			or(
				and(
					eq(friendsTable.user_id, userId),
					eq(friendsTable.friend_id, friendId),
					eq(friendsTable.is_accepted, true),
				),
				and(
					eq(friendsTable.user_id, friendId),
					eq(friendsTable.friend_id, userId),
					eq(friendsTable.is_accepted, true),
				),
			),
		);

	return response;
};
