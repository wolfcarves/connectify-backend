import express from 'express';
import * as chatController from './chat.controller';
import * as chatDocumentation from './chat.docs';
import { requireAuth } from '@/middleware/auth.middleware';

const ChatRouter = express.Router();

chatDocumentation.getChatsDocs();
ChatRouter.get('/', requireAuth, chatController.getChats);

ChatRouter.get('/:userId', requireAuth, chatController.getChatConversation);

chatDocumentation.sendMessageDocs();
ChatRouter.post('/send', requireAuth, chatController.sendMessage);

export default ChatRouter;
