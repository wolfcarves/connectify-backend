import { db } from '@/db';
import { chatMembersTable, chatsTable } from '@/models/chatTable';
import { eq } from 'drizzle-orm';

export const isRecipientAlreadyJoined = async (recipientId?: number) => {
	if (!recipientId) return false;

	const [response] = await db
		.select()
		.from(chatsTable)
		.where(eq(chatMembersTable.user_id, recipientId))
		.leftJoin(
			chatMembersTable,
			eq(chatMembersTable.chat_id, chatsTable.id),
		);

	return !!response;
};

export const isChatExists = async (chatId?: number) => {
	if (!chatId) return false;

	const [response] = await db
		.select()
		.from(chatsTable)
		.where(eq(chatsTable.id, chatId));

	return !!response;
};
