import { db } from '@/db';
import { chatMembersTable, chatsTable } from '@/models/chatTable';
import { aliasedTable, and, eq } from 'drizzle-orm';

export const getChatId = async (userId: number, recipientId: number) => {
	const chatMembersTable2 = aliasedTable(chatMembersTable, 'cm2');

	const [chat] = await db
		.select({ id: chatMembersTable.chat_id })
		.from(chatMembersTable)
		.innerJoin(
			chatMembersTable2,
			eq(chatMembersTable.chat_id, chatMembersTable2.chat_id),
		)
		.where(
			and(
				eq(chatMembersTable.user_id, userId),
				eq(chatMembersTable2.user_id, recipientId),
			),
		)
		.limit(1);

	return chat?.id;
};

export const isChatExists = async (chatId?: number) => {
	if (!chatId) return false;

	const [response] = await db
		.select()
		.from(chatsTable)
		.where(eq(chatsTable.id, chatId));

	return !!response;
};
