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

FriendsDocs.sendFriendRequestDocs();
FriendRouter.post(
	'/request/send/:receiverId',
	requireAuth,
	FriendsController.sendFriendRequest,
);

FriendsDocs.cancelFriendRequestDocs();
FriendRouter.delete(
	'/request/cancel/:requesterId',
	requireAuth,
	FriendsController.cancelFriendRequest,
);

FriendsDocs.getFriendRequestsDocs();
FriendRouter.get('/requests', requireAuth, FriendsController.getFriendRequests);

FriendsDocs.acceptFriendRequestDocs();
FriendRouter.post(
	'/request/accept/:friendId',
	requireAuth,
	FriendsController.acceptFriendRequest,
);

FriendsDocs.getFriendListDocs();
FriendRouter.get('/list/:userId', requireAuth, FriendsController.getFriendList);

FriendsDocs.unfriendUserDocs();
FriendRouter.delete(
	'/remove/:friendId',
	requireAuth,
	FriendsController.unfriendUser,
);

export default FriendRouter;
