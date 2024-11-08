import { db } from '@/db';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { friendRequestsTable, friendshipsTable } from '@/models/friendsTable';
import { usersTable } from '@/models/usersTable';
import { and, desc, eq, isNull, ne, notExists, or, sql } from 'drizzle-orm';
import { type PostgresError } from 'postgres';
import { applySameCityQuery, checkFriendStatus } from './friend.helper';
import * as userService from '../user/user.service';

/*

	Process

	* default query or base query for friend suggestions
	* query function for fetching same city && prioritize real users
	* query function for fetching users friends of friends. 
	* 

*/

export const getFriendsSuggestions = async (userId: number) => {
	const user = await userService.getUser({ userId });

	const query = sql.raw(`
		WITH 
			has_friend_request AS (
				SELECT sender_id AS friendId
				FROM friend_request
				WHERE receiver_id = ${userId}
			),
			is_friend AS (
				SELECT friend_id as friendId 
				FROM friendships
				WHERE user_id = ${userId} 
				UNION
				SELECT user_id as friendId
				FROM friendships
				WHERE friend_id = ${userId} 
			)

			SELECT
				u.id,
				u.avatar,
				u.name,
				u.username,
				fr.status,
				u.city
			FROM
				"user" u
			LEFT JOIN
				friend_request fr
			ON
				fr.sender_id = ${userId} AND fr.receiver_id = u.id
			WHERE
				u.id <> ${userId}
				AND u.id NOT IN (SELECT friendId FROM has_friend_request)
				AND u.id NOT IN (SELECT friendId FROM is_friend)
	`);

	if (user?.city) {
		applySameCityQuery(query, user?.city);
	} else {
		query.append(sql.raw(`ORDER BY id DESC LIMIT 50;`));
	}

	const response = await db.execute(query);

	return response;
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
		const { is_friend } = await checkFriendStatus(senderId, receiverId);

		if (is_friend)
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
			userId: usersTable.id,
			avatar: usersTable.avatar,
			name: usersTable.name,
			username: usersTable.username,
			status: friendRequestsTable.status,
			created_at: friendRequestsTable.created_at,
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
		const { is_friend } = await checkFriendStatus(userId, friendId);

		if (is_friend) throw new NotFoundException('No user to accept');

		await db.transaction(async tx => {
			await tx
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

			await tx.insert(friendshipsTable).values({
				user_id: userId,
				friend_id: friendId,
			});
		});
	} catch (error) {
		throw new NotFoundException('No user to accept');
	}
};

export const getFriendList = async (sessionUserId: number, userId: number) => {
	const friendListQuery = sql.raw(
		`SELECT 
			u."id",
			u."name",
			u."username",
			u."avatar",
			u."created_at",
			CASE
				WHEN 
					f2."user_id" = u."id" 
				OR
					f2."friend_id" = u."id" 
				THEN TRUE
				ELSE FALSE
			END AS is_friend,
			CASE
				WHEN 
					f3."sender_id" = u."id" 
				OR
					f3."receiver_id" = u."id" 
				THEN TRUE
				ELSE FALSE
			END AS has_request,
			CASE
				WHEN f3."sender_id" = ${sessionUserId} THEN 'us'
				WHEN f3."receiver_id" = ${sessionUserId} THEN 'them'
				ELSE 'them'
			END AS request_from
			
		FROM 
			"friendships" f

		INNER JOIN 
			"user" u ON 
			(
				(f."user_id" = ${userId} AND f."friend_id" = u."id" AND f."friend_id" <> ${sessionUserId}) OR
				(f."user_id" = u."id" AND f."friend_id" = ${userId} AND f."user_id" <> ${sessionUserId})
			)

		-- FOR CHECKING IF SESSION USER ID IS FRIEND
		
		LEFT JOIN 
			"friendships" f2 ON 
			( 
				(f2."user_id" = ${sessionUserId} AND f2."friend_id" = u."id") OR 
				(f2."user_id" = u."id" AND f2."friend_id" = ${sessionUserId}) 
			)
			
		-- FOR CHECKING IF SESSION USER ID HAS FRIEND REQUEST

		LEFT JOIN 
			"friend_request" f3 ON
			(
				(f3."sender_id" = ${sessionUserId} AND f3."receiver_id" = u."id") OR 
				(f3."sender_id" = u."id" AND f3."receiver_id" = ${sessionUserId})
			);`,
	);

	const friendList = await db.execute(friendListQuery);

	return friendList;
};

export const unfriendUser = async (userId: number, friendId: number) => {
	const response = await db.transaction(async tx => {
		const friendShipsResponse = await tx
			.delete(friendshipsTable)
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
			);

		if (!friendShipsResponse)
			throw new NotFoundException('No user to unfriend');

		const friendRequestResponse = await tx
			.delete(friendRequestsTable)
			.where(
				or(
					and(
						eq(friendRequestsTable.sender_id, userId),
						eq(friendRequestsTable.receiver_id, friendId),
					),
					and(
						eq(friendRequestsTable.sender_id, friendId),
						eq(friendRequestsTable.receiver_id, userId),
					),
				),
			);

		return friendRequestResponse;
	});

	return response;
};

/* Friend Suggestions

const query = await db
		.select({
			id: usersTable.id,
			avatar: usersTable.avatar,
			name: usersTable.name,
			username: usersTable.username,
			status: friendRequestsTable.status,
			city: usersTable.city,
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
							and(
								eq(
									friendRequestsTable.sender_id,
									usersTable.id,
								),
								eq(friendRequestsTable.receiver_id, userId),
							),
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
		.orderBy(desc(usersTable.id))
		.limit(50);

*/
