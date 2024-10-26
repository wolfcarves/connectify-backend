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
	EngagementController.createComment,
);

EngagementDocumentation.getPostCommentsDocs();
EngagementRoute.get(
	'/comments/:postId',
	requireAuth,
	EngagementController.getComments,
);

export default EngagementRoute;
