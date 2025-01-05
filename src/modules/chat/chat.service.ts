import { db } from '@/db';
import postgres from 'postgres';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { ForbiddenException } from '@/exceptions/ForbiddenException';
import {
	chatMembersTable,
	chatMessageReadsTable,
	chatMessagesTable,
	chatsTable,
} from '@/models/chatTable';
import { usersTable } from '@/models/usersTable';
import {
	aliasedTable,
	and,
	count,
	desc,
	eq,
	isNotNull,
	ne,
	or,
	sql,
} from 'drizzle-orm';
import { getChatId } from './chat.helper';

export const createChat = async (userId: number, recipientId: number) => {
	try {
		const chatId = await getChatId(userId, recipientId);

		if (userId === recipientId)
			throw new ForbiddenException(
				'You cannot create a chat with yourself',
			);

		if (chatId) {
			return {
				chat_id: chatId,
			};
		}

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

export const getChat = async (userId: number, chatId: number) => {
	const chatMembersTable2 = aliasedTable(chatMembersTable, 'cm2');

	const [chat] = await db
		.select({
			id: chatsTable.id,
			user_id: chatMembersTable.user_id,
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
		.from(chatMembersTable)
		.innerJoin(
			chatMembersTable2,
			eq(chatMembersTable2.chat_id, chatMembersTable.chat_id),
		)
		.innerJoin(usersTable, eq(usersTable.id, chatMembersTable.user_id))
		.innerJoin(chatsTable, eq(chatsTable.id, chatMembersTable.chat_id))
		.where(
			and(
				ne(chatMembersTable.user_id, userId),
				eq(chatMembersTable2.user_id, userId),
				eq(chatMembersTable2.chat_id, chatId),
			),
		);

	if (!chat) throw new NotFoundException('Chat not found');

	return chat;
};

export const getChats = async (
	userId: number,
	page: number,
	perPage: number,
) => {
	const chats = await db
		.select({
			id: chatMembersTable.chat_id,
			avatar: usersTable.avatar,
			name: usersTable.name,
			is_read: sql`CASE
							WHEN ${chatMessageReadsTable.user_id} = ${userId}
								AND ${chatMessageReadsTable.message_id} = ${chatMessagesTable.id}
							THEN TRUE
							ELSE FALSE
						END`.as('is_read'),
			latest_message: chatMessagesTable.content,
			latest_message_at: chatMessagesTable.created_at,
		})
		.from(chatMembersTable)
		.innerJoin(usersTable, eq(usersTable.id, chatMembersTable.user_id))
		.leftJoin(
			chatMessageReadsTable,
			and(
				eq(chatMessageReadsTable.chat_id, chatMembersTable.chat_id),
				eq(chatMessageReadsTable.user_id, userId),
			),
		)
		.leftJoin(
			chatMessagesTable,
			and(
				eq(chatMessagesTable.chat_id, chatMembersTable.chat_id),
				sql`${chatMessagesTable.id} = (
					SELECT MAX(id)
					FROM ${chatMessagesTable}
					WHERE chat_id = ${chatMembersTable.chat_id}
				)`,
			),
		)
		.where(
			and(
				sql`${chatMembersTable.chat_id} IN (
					SELECT chat_id
					FROM ${chatMembersTable}
					WHERE user_id = ${userId}
				)`,
				ne(chatMembersTable.user_id, userId),
			),
		)
		.orderBy(desc(chatMessagesTable.created_at))
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
) => {
	const messages = await db.transaction(async tx => {
		const messagesResult = await tx
			.select({
				id: chatMessagesTable.id,
				sender_id: chatMessagesTable.sender_id,
				content: chatMessagesTable.content,
				created_at: chatMessagesTable.created_at,
				updated_at: chatMessagesTable.updated_at,
			})
			.from(chatMessagesTable)
			.innerJoin(
				chatMembersTable,
				eq(chatMessagesTable.chat_id, chatMembersTable.chat_id),
			)
			.where(
				and(
					eq(chatMessagesTable.chat_id, chatId),
					eq(chatMembersTable.user_id, userId),
				),
			)
			.orderBy(desc(chatMessagesTable.created_at))
			.limit(perPage)
			.offset((page - 1) * perPage);

		const latestMessage = messagesResult[0];

		if (latestMessage) {
			const values = {
				chat_id: chatId,
				message_id: latestMessage.id,
				user_id: userId,
			};

			await tx
				.insert(chatMessageReadsTable)
				.values(values)
				.onConflictDoUpdate({
					target: [
						chatMessageReadsTable.chat_id,
						chatMessageReadsTable.user_id,
					],
					set: values,
				});
		}

		return messagesResult;
	});

	if (messages.length === 0) throw new NotFoundException('No messages');

	const totalCount = await db
		.select({ count: count(chatMessagesTable.id) })
		.from(chatMessagesTable)
		.where(eq(chatMessagesTable.chat_id, chatId))
		.then(res => res[0].count);

	const itemsTaken = page * perPage;
	const remaining = totalCount - itemsTaken;

	return {
		messages,
		total_items: totalCount,
		remaining_items: Math.max(0, remaining),
	};
};

export const sendMessage = async (
	senderId: number,
	chatId: number,
	content: string,
) => {
	if (!content) throw new BadRequestException('Message is empty.');

	const isMember = await db
		.select({ id: chatMembersTable.id })
		.from(chatMembersTable)
		.where(
			and(
				eq(chatMembersTable.chat_id, chatId),
				eq(chatMembersTable.user_id, senderId),
			),
		)
		.limit(1);

	if (isMember.length === 0) {
		throw new BadRequestException('You are not a member of this chat');
	}

	const newMessage = await db.transaction(async tx => {
		const newMessageResult = await tx
			.insert(chatMessagesTable)
			.values({
				sender_id: senderId,
				chat_id: chatId,
				content,
				created_at: new Date(),
				updated_at: new Date(),
			})
			.returning({
				messageId: chatMessagesTable.id,
			});

		const values = {
			chat_id: chatId,
			message_id: newMessageResult[0].messageId,
			user_id: senderId,
		};

		await tx
			.insert(chatMessageReadsTable)
			.values(values)
			.onConflictDoUpdate({
				target: [
					chatMessageReadsTable.chat_id,
					chatMessageReadsTable.user_id,
				],
				set: values,
			});

		return newMessageResult[0];
	});

	return newMessage;
};

/*
const chats = await db
		.selectDistinctOn([chatsTable.id], {
			id: chatsTable.id,
			avatar: sql`
						CASE
							WHEN ${chatsTable.name} IS NOT NULL
							THEN ${chatsTable.name}
							ELSE (
								SELECT ${usersTable.avatar}
								FROM ${usersTable}
								INNER JOIN ${chatMembersTable}
									ON ${usersTable.id} = ${chatMembersTable.user_id}
								WHERE ${chatMembersTable.chat_id} = ${chatsTable.id}
								AND ${usersTable.id} != ${userId}
								LIMIT 1
							)
						END
				`,
			name: sql`
					CASE
						WHEN ${chatsTable.name} IS NOT NULL
						THEN ${chatsTable.name}
						ELSE (
							SELECT ${usersTable.name}
							FROM ${usersTable}
							INNER JOIN ${chatMembersTable}
								ON ${usersTable.id} = ${chatMembersTable.user_id}
							WHERE ${chatMembersTable.chat_id} = ${chatsTable.id}
							AND ${usersTable.id} != ${userId}
							LIMIT 1
						)
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
			and(
				eq(chatMessagesTable.chat_id, chatsTable.id),
				eq(
					chatMessagesTable.id,
					sql`(
                    SELECT MAX(${chatMessagesTable.id})
                    FROM ${chatMessagesTable}
                    WHERE ${chatMessagesTable.chat_id} = ${chatsTable.id}
                )`,
				),
			),
		)
		.where(
			and(
				eq(chatMembersTable.user_id, userId),
				sql`
				EXISTS (
					SELECT 1
					FROM ${chatMessagesTable}
					WHERE ${chatMessagesTable.chat_id} = ${chatsTable.id}
				)`,
			),
		)
		.orderBy(desc(chatsTable.id), desc(chatMessagesTable.created_at))
		.limit(perPage)
		.offset((page - 1) * perPage);
*/
