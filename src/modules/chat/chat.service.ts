import { db } from '@/db';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { socketIO } from '@/lib/socket';
import { chatTable } from '@/models/chatTable';
import { usersTable } from '@/models/usersTable';
import { and, desc, eq, or, sql } from 'drizzle-orm';
import postgres from 'postgres';

export const getChats = async (
	userId: number,
	page: number,
	perPage: number,
) => {
	const socket = socketIO();

	const totalChatCount = await db
		.select({
			count: sql<number>`COUNT(DISTINCT CONCAT(${chatTable.user_id}, '-', ${chatTable.recipient_id}))`,
		})
		.from(chatTable)
		.where(eq(chatTable.user_id, userId))
		.then(result => result[0]?.count || 0);

	const chats = await db
		.selectDistinctOn([chatTable.user_id, chatTable.recipient_id], {
			id: chatTable.id,
			username: usersTable.username,
			name: usersTable.name,
			message: chatTable.message,
			roomId: sql<string>`CONCAT(${chatTable.user_id},${chatTable.recipient_id})`,
			created_at: chatTable.created_at,
			updated_at: chatTable.updated_at,
		})
		.from(chatTable)
		.innerJoin(
			usersTable,
			or(
				eq(usersTable.id, chatTable.user_id),
				eq(usersTable.id, chatTable.recipient_id),
			),
		)
		.where(
			or(
				eq(chatTable.user_id, userId),
				eq(chatTable.recipient_id, userId),
			),
		)
		.orderBy(
			desc(chatTable.user_id),
			desc(chatTable.recipient_id),
			desc(chatTable.created_at),
		)
		.limit(perPage)
		.offset((page - 1) * perPage);

	if (chats.length === 0) throw new NotFoundException('No chats yet');

	const itemsTaken = page * perPage;
	const remaining = Number(totalChatCount) - itemsTaken;

	socket?.on('join_room', data => {
		console.log('join_data', data);

		socket?.socketsJoin(data);
	});

	return {
		chats,
		total_items: Number(totalChatCount),
		remaining_items: Math.max(0, remaining),
	};
};

export const getChatConversation = async (
	userId: number,
	friendId: number,
	page: number,
	perPage: number,
) => {
	// const totalChatCount = await db
	// 	.select({
	// 		count: sql<number>`COUNT(DISTINCT CONCAT(${chatTable.user_id}, '-', ${chatTable.recipient_id}))`,
	// 	})
	// 	.from(chatTable)
	// 	.where(eq(chatTable.user_id, userId))
	// 	.then(result => result[0]?.count || 0);

	const response = await db
		.select()
		.from(chatTable)
		.where(
			or(
				and(
					eq(chatTable.user_id, userId),
					eq(chatTable.recipient_id, friendId),
				),
				and(
					eq(chatTable.recipient_id, userId),
					eq(chatTable.user_id, friendId),
				),
			),
		);

	return response;

	// const chats = await db
	// 	.selectDistinctOn([chatTable.user_id, chatTable.recipient_id], {
	// 		id: chatTable.id,
	// 		username: usersTable.username,
	// 		name: usersTable.name,
	// 		message: chatTable.message,
	// 		created_at: chatTable.created_at,
	// 		updated_at: chatTable.updated_at,
	// 	})
	// 	.from(chatTable)
	// 	.innerJoin(usersTable, eq(usersTable.id, chatTable.user_id))
	// 	.where(eq(chatTable.user_id, userId))
	// 	.orderBy(
	// 		desc(chatTable.user_id),
	// 		desc(chatTable.recipient_id),
	// 		desc(chatTable.created_at),
	// 	)
	// 	.limit(perPage)
	// 	.offset((page - 1) * perPage);

	// const itemsTaken = page * perPage;
	// const remaining = Number(totalChatCount) - itemsTaken;

	// return {
	// 	chats,
	// 	total_items: Number(totalChatCount),
	// 	remaining_items: Math.max(0, remaining),
	// };
};

export const sendMessage = async (
	userId: number,
	recipientId: number,
	message: string,
): Promise<{ messageId: number } | undefined> => {
	try {
		if (!userId || !recipientId)
			throw new NotFoundException('Target not found');

		if (userId == recipientId)
			throw new BadRequestException(
				'You cannot send a message to yourself',
			);

		const [response] = await db
			.insert(chatTable)
			.values({
				user_id: userId,
				recipient_id: recipientId,
				message,
			})
			.returning({ messageId: chatTable.id });

		return response;
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			if (error.code === '23503') {
				throw new NotFoundException('Recipient not found.');
			}
		}

		throw error;
	}
};
