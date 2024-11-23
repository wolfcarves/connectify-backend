import express from 'express';
import * as FeedController from './feed.controller';
import { requireAuth } from '@/middleware/auth.middleware';

const FeedRouter = express.Router();

FeedRouter.get('/posts/world', requireAuth, FeedController.getFeedWorldPosts);

FeedRouter.get(
	'/posts/friends',
	requireAuth,
	FeedController.getFeedFriendsPosts,
);

export default FeedRouter;
