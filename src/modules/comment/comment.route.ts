import { Router } from 'express';
import { requireAuth } from '@/middleware/auth.middleware';
import * as CommentController from './comment.controller';
import * as CommentDocumentation from './comment.docs';

const CommentRouter = Router();

CommentDocumentation.createCommentDocs();
CommentRouter.post('/', requireAuth, CommentController.createComment);

CommentDocumentation.getCommentsDocs();
CommentRouter.get('/', requireAuth, CommentController.getComments);

export default CommentRouter;
