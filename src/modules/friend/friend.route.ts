import express from 'express';
import * as FriendsController from './friend.controller';
import * as FriendsDocs from './friend.docs';
import { requireAuth } from '@/middleware/auth.middleware';

const FriendRouter = express.Router();

FriendsDocs.friendSuggestionsDocs();
FriendRouter.get(
	'/suggestions',
	requireAuth,
	FriendsController.getFriendsSuggestions,
);

FriendRouter.post(
	'/request/send',
	requireAuth,
	FriendsController.sendFriendRequest,
);

FriendRouter.get('/request', requireAuth, FriendsController.getFriendRequests);

FriendRouter.post(
	'/request/accept/:friendId',
	requireAuth,
	FriendsController.acceptFriendRequest,
);

FriendRouter.get('/', requireAuth, FriendsController.getFriendList);

FriendRouter.delete(
	'/remove/:friendId',
	requireAuth,
	FriendsController.unfriendUser,
);

export default FriendRouter;
