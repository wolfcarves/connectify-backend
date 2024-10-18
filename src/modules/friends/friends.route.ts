import express from 'express';
import * as FriendsController from './friends.controller';
import * as FriendsDocs from './friends.docs';

const FriendRouter = express.Router();

FriendsDocs.friendSuggestionsDocs();
FriendRouter.get('/suggestions', FriendsController.getFriendsSuggestions);

export default FriendRouter;
