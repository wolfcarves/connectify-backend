import express from 'express';
import * as chatController from './chat.controller';

const ChatRouter = express.Router();

ChatRouter.get('/', chatController.getChats);

export default ChatRouter;
