import { requireAuth } from '@/middleware/auth.middleware';
import { Router } from 'express';
import * as EngagementController from './engagement.controller';
import * as EngagementDocumentation from './engagement.docs';

const EngagementRoute = Router();

EngagementDocumentation.likePostDocs();
EngagementRoute.post(
	'/like/:postId',
	requireAuth,
	EngagementController.likePost,
);

EngagementDocumentation.createPostCommentDocs();
EngagementRoute.post(
	'/comment/:postId',
	requireAuth,
	EngagementController.createPostComment,
);

EngagementRoute.get(
	'/comment/:postId',
	requireAuth,
	EngagementController.getPostComments,
);

export default EngagementRoute;