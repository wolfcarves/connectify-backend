import { Router } from 'express';
import { requireAuth } from '@/middleware/auth.middleware';
import * as CommentController from './comment.controller';
import * as CommentDocumentation from './comment.docs';

const CommentRouter = Router();

CommentDocumentation.createPostCommentDocs();
CommentRouter.post('/', requireAuth, CommentController.createComment);

CommentDocumentation.getPostCommentsDocs();
CommentRouter.get(
	'/post/:postId',
	requireAuth,
	CommentController.getCommentsByPost,
);

export default CommentRouter;
