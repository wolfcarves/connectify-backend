import express from 'express';
import { requireAuth } from '@/middleware/auth.middleware';
import * as FeedController from './feed.controller';
import * as FeedDocumentation from './feed.docs';

const FeedRouter = express.Router();

FeedDocumentation.getFeedDiscoverPostsDocs();
FeedRouter.get(
	'/posts/discover',
	requireAuth,
	FeedController.getFeedWorldPosts,
);

FeedDocumentation.getFeedFriendsPostsDocs();
FeedRouter.get(
	'/posts/friends',
	requireAuth,
	FeedController.getFeedFriendsPosts,
);

export default FeedRouter;
