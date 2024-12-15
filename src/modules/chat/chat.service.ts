import { db } from '@/db';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import {
	chatMembersTable,
	chatMessagesTable,
	chatsTable,
} from '@/models/chatTable';
import { usersTable } from '@/models/usersTable';
import { and, count, desc, eq, ne } from 'drizzle-orm';
import { isChatExists, isRecipientAlreadyJoined } from './chat.helper';

export const getChats = async (
	userId: number,
	page: number,
	perPage: number,
) => {
	const [chatRows] = await db
		.selectDistinctOn([chatsTable.id], {
			count: count(chatsTable.id),
		})
		.from(chatsTable)
		.where(ne(chatMembersTable.user_id, userId))
		.innerJoin(
			chatMembersTable,
			eq(chatMembersTable.chat_id, chatsTable.id),
		)
		.innerJoin(usersTable, eq(usersTable.id, chatMembersTable.user_id))
		.innerJoin(
			chatMessagesTable,
			eq(chatMessagesTable.sender_id, usersTable.id),
		)
		.groupBy(chatsTable.id);

	const chats = await db
		.selectDistinctOn([chatsTable.id], {
			id: chatsTable.id,
			avatar: usersTable.avatar,
			userId: usersTable.id,
			username: usersTable.username,
			message: chatMessagesTable.content,
			name: usersTable.name,
			// created_at: chatsTable.id,
			// updated_at: chatsTable.id,
		})
		.from(chatsTable)
		.innerJoin(
			chatMembersTable,
			and(
				eq(chatMembersTable.chat_id, chatsTable.id),
				ne(chatMembersTable.user_id, userId),
			),
		)
		.innerJoin(usersTable, eq(usersTable.id, chatMembersTable.user_id))
		.innerJoin(
			chatMessagesTable,
			eq(chatMessagesTable.chat_id, chatsTable.id),
		)
		.orderBy(desc(chatsTable.id), desc(chatMessagesTable.created_at))
		.offset((page - 1) * perPage)
		.limit(perPage);

	const totalCount = chatRows.count;

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
	content: string,
	chatId?: number,
	recipientId?: number,
) => {
	if (!chatId && !recipientId)
		throw new NotFoundException('Recipient not found');

	if (senderId == chatId || senderId === recipientId)
		throw new BadRequestException('You cannot send a message to yourself');

	if (!chatId && recipientId) {
		const isJoined = await isRecipientAlreadyJoined(recipientId);

		if (isJoined)
			throw new BadRequestException('chat_id is expected but undefined');

		const response = await db.transaction(async tx => {
			const [chatResponse] = await tx
				.insert(chatsTable)
				.values({})
				.returning({ chat_id: chatsTable.id });

			const chat_id = chatResponse.chat_id;

			await tx.insert(chatMembersTable).values({
				user_id: senderId,
				chat_id,
			});

			await tx.insert(chatMembersTable).values({
				user_id: recipientId,
				chat_id,
			});

			const [messageResponse] = await tx
				.insert(chatMessagesTable)
				.values({
					chat_id,
					sender_id: senderId,
					content,
				})
				.returning({ chatId: chatsTable.id });

			return messageResponse;
		});

		return response;
	}

	const exists = await isChatExists(chatId);
	if (!exists) throw new NotFoundException("Chat doesn't exist");

	const [response] = await db
		.insert(chatMessagesTable)
		.values({
			chat_id: chatId,
			sender_id: senderId,
			content,
		})
		.returning({ chatId: chatsTable.id });

	return response;
};
