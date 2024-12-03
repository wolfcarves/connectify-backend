import { Router } from 'express';
import { requireAuth } from '@/middleware/auth.middleware';
import * as ReplyDocumentation from './reply.docs';
import * as ReplyController from './reply.controller';

const ReplyRouter = Router();

ReplyDocumentation.createPostReplyDocs();
ReplyRouter.post(
	'/comment/:commentId',
	requireAuth,
	ReplyController.createReply,
);

ReplyDocumentation.getCommentRepliesDocs();
ReplyRouter.get('/comment/:commentId', requireAuth, ReplyController.getReplies);

export default ReplyRouter;
