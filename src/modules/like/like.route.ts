import { requireAuth } from '@/middleware/auth.middleware';
import { Router } from 'express';
import * as LikeController from './like.controller';
import * as LikeDocumentation from './like.docs';

const LikeRouter = Router();

LikeDocumentation.likePostDocs();
LikeRouter.post('/:postId', requireAuth, LikeController.likePost);

export default LikeRouter;
