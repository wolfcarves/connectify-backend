import express from 'express';
import * as chatController from './chat.controller';
import * as chatDocumentation from './chat.docs';
import { requireAuth } from '@/middleware/auth.middleware';

const ChatRouter = express.Router();

chatDocumentation.createChatDocs();
ChatRouter.post('/create/:recipientId', requireAuth, chatController.createChat);

chatDocumentation.getChatDocs();
ChatRouter.get('/:chatId', requireAuth, chatController.getChat);

chatDocumentation.getChatsDocs();
ChatRouter.get('/', requireAuth, chatController.getChats);

chatDocumentation.getChatMessagesDocs();
ChatRouter.get(
	'/messages/:chatId',
	requireAuth,
	chatController.getChatMessages,
);

chatDocumentation.sendMessageDocs();
ChatRouter.post('/send/:chatId', requireAuth, chatController.sendMessage);

export default ChatRouter;
