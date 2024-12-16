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
			group_name: chatsTable.name,
			avatar: usersTable.avatar,
			username: usersTable.username,
			name: usersTable.name,
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
			and(
				eq(chatMembersTable.user_id, userId),
				eq(chatMembersTable.chat_id, chatsTable.id),
			),
		)
		.innerJoin(usersTable, eq(usersTable.id, chatMembersTable.user_id))
		.where(eq(chatMembersTable.chat_id, chatsTable.id))
		.groupBy(chatsTable.id);

	const _chatIds = chatIds.map(c => c.id);

	const chats = await db
		.select({
			id: chatsTable.id,
			group_name: sql`
				CASE
					WHEN ${chatsTable.name} IS NOT NULL
					THEN ${chatsTable.name}
					ELSE ${usersTable.name}
				END`,
			avatar: usersTable.avatar,
			username: usersTable.username,
			name: usersTable.name,
			latest_message: chatMessagesTable.content,
			latest_message_at: chatMessagesTable.created_at,
		})
		.from(chatsTable)
		.innerJoin(chatMembersTable, ne(chatMembersTable.user_id, userId))
		.innerJoin(usersTable, eq(usersTable.id, chatMembersTable.user_id))
		.innerJoin(
			chatMessagesTable,
			and(
				eq(chatMessagesTable.chat_id, chatsTable.id),
				eq(
					chatMessagesTable.created_at,
					db
						.select({ latest: max(chatMessagesTable.created_at) })
						.from(chatMessagesTable)
						.where(eq(chatMessagesTable.chat_id, chatsTable.id)),
				),
			),
		)
		.where(inArray(chatsTable.id, _chatIds))
		.limit(perPage)
		.offset((page - 1) * perPage)
		.orderBy(chatsTable.created_at);

	if (chats.length === 0) throw new NotFoundException('No chats');

	const totalCount = chatIds?.[0].count;

	const itemsTaken = page * perPage;
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
) => {
	const [chatRows] = await db
		.select({
			total: count(chatMessagesTable.id),
		})
		.from(chatMessagesTable)
		.where(eq(chatMessagesTable.chat_id, chatId));

	const chats = await db
		.select({
			id: chatMessagesTable.id,
			content: chatMessagesTable.content,
			is_own: eq(chatMessagesTable.sender_id, userId),
			created_at: chatMessagesTable.created_at,
			updated_at: chatMessagesTable.updated_at,
		})
		.from(chatMessagesTable)
		.where(eq(chatMessagesTable.chat_id, chatId))
		.orderBy(desc(chatMessagesTable.created_at))
		.offset((page - 1) * perPage)
		.limit(perPage);

	if (chats.length === 0) throw new NotFoundException('No messages.');

	const totalCount = chatRows.total;

	const itemsTaken = page * perPage;
	const remaining = totalCount - itemsTaken;

	return {
		chats,
		total_items: totalCount,
		remaining_items: Math.max(0, remaining),
	};
};

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
