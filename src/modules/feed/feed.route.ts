import express from 'express';
import { requireAuth } from '@/middleware/auth.middleware';
import * as FeedController from './feed.controller';
import * as FeedDocumentation from './feed.docs';

const FeedRouter = express.Router();

FeedDocumentation.getFeedWorldPosts();
FeedRouter.get('/posts/world', requireAuth, FeedController.getFeedWorldPosts);

FeedDocumentation.getFeedFriendsPosts();
FeedRouter.get(
	'/posts/friends',
	requireAuth,
	FeedController.getFeedFriendsPosts,
);

export default FeedRouter;
