import { db } from '@/db';
import postgres from 'postgres';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { ForbiddenException } from '@/exceptions/ForbiddenException';
import {
	chatMembersTable,
	chatMessagesTable,
	chatsTable,
} from '@/models/chatTable';
import { usersTable } from '@/models/usersTable';
import { and, count, desc, eq, inArray, max, ne, sql } from 'drizzle-orm';
import { isChatExists, getChatId } from './chat.helper';

export const createChat = async (userId: number, recipientId: number) => {
	try {
		const isJoinedAlready = !!(await getChatId(userId, recipientId));

		if (userId === recipientId)
			throw new ForbiddenException(
				'You cannot create a ch	at with yourself',
			);

		if (isJoinedAlready)
			throw new BadRequestException('Chat already created');

		const response = await db.transaction(async tx => {
			const [chatResponse] = await tx
				.insert(chatsTable)
				.values({})
				.returning({ chat_id: chatsTable.id });

			const chat_id = chatResponse.chat_id;

			await tx.insert(chatMembersTable).values({
				user_id: userId,
				chat_id,
			});

			await tx.insert(chatMembersTable).values({
				user_id: recipientId,
				chat_id,
			});

			return { chat_id };
		});

		return response;
	} catch (error) {
		// If recipientId is not found
		if (error instanceof postgres.PostgresError) {
			if (error.code === '23503') {
				throw new NotFoundException('Recipient not found');
			}
		}

		throw error;
	}
};

export const getChat = async (userId: number, recipientId: number) => {
	const isChatExists = !!(await getChatId(userId, recipientId));

	if (!isChatExists || userId === recipientId)
		throw new NotFoundException('Chat not found');

	const [chat] = await db
		.select({
			id: chatsTable.id,
			name: sql`
				CASE
					WHEN ${chatsTable.name} IS NOT NULL
					THEN ${chatsTable.name}
					ELSE ${usersTable.name}
				END`,
			avatar: usersTable.avatar,
			created_at: chatsTable.created_at,
			updated_at: chatsTable.updated_at,
		})
		.from(chatsTable)
		.where(eq(chatMembersTable.user_id, recipientId))
		.innerJoin(
			chatMembersTable,
			eq(chatMembersTable.chat_id, chatsTable.id),
		)
		.innerJoin(usersTable, eq(chatMembersTable.user_id, usersTable.id));

	return chat;
};

export const getChats = async (
	userId: number,
	page: number,
	perPage: number,
) => {
	const chatIds = await db
		.select({
			id: chatsTable.id,
			count: count(chatsTable.id),
		})
		.from(chatsTable)
		.innerJoin(
			chatMembersTable,
			eq(chatMembersTable.chat_id, chatsTable.id),
		)
		.where(eq(chatMembersTable.user_id, userId))
		.groupBy(chatsTable.id);

	const _chatIds = chatIds.map(c => c.id);

	const chats = await db
		.selectDistinctOn([chatsTable.id], {
			id: chatsTable.id,
			avatar: usersTable.avatar,
			name: sql`
				CASE
					WHEN ${chatsTable.name} IS NOT NULL
					THEN ${chatsTable.name}
					ELSE ${usersTable.name}
				END`,
			latest_message: sql`
					CASE
						WHEN ${chatMessagesTable.sender_id} = ${userId}
						THEN CONCAT('You: ', ${chatMessagesTable.content})
						ELSE ${chatMessagesTable.content}
					END`,
			latest_message_at: chatMessagesTable.created_at,
		})
		.from(chatsTable)
		.innerJoin(
			chatMembersTable,
			eq(chatMembersTable.chat_id, chatsTable.id),
		)
		.innerJoin(usersTable, eq(usersTable.id, chatMembersTable.user_id))
		.innerJoin(
			chatMessagesTable,
			eq(chatMessagesTable.chat_id, chatsTable.id),
		)
		.where(inArray(chatsTable.id, _chatIds))
		.orderBy(chatsTable.id, chatsTable.created_at)
		.limit(perPage)
		.offset((page - 1) * perPage);

	if (chats.length === 0) throw new NotFoundException('No chats');

	const totalCount = (
		await db
			.select({
				count: count(chatsTable.id),
			})
			.from(chatsTable)
			.innerJoin(
				chatMembersTable,
				eq(chatMembersTable.chat_id, chatsTable.id),
			)
			.where(eq(chatMembersTable.user_id, userId))
	)[0].count;

	const itemsTaken = chats.length;
	const remaining = totalCount - itemsTaken;

	return {
		chats,
		total_items: totalCount,
		remaining_items: Math.max(0, remaining),
	};
};

export const getChatMessages = async (
	userId: number,
	chatId: number,
	page: number,
	perPage: number,
) => {};

export const sendMessage = async (
	senderId: number,
	chatId: number,
	content: string,
) => {
	try {
		const exists = await isChatExists(chatId);

		if (!chatId || !exists) throw new NotFoundException('Chat not found');

		const [createdMessage] = await db
			.insert(chatMessagesTable)
			.values({
				chat_id: chatId,
				sender_id: senderId,
				content,
			})
			.returning({ chatId: chatsTable.id });

		return createdMessage;
	} catch (error) {
		// If recipientId is not found
		if (error instanceof postgres.PostgresError) {
			if (error.code === '23503') {
				throw new NotFoundException('Chat not found');
			}
		}

		throw error;
	}
};
