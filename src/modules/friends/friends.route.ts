import express from 'express';
import * as FriendsController from './friends.controller';

const FriendRouter = express.Router();

FriendRouter.get('/suggestions', FriendsController.getFriendsSuggestions);

export default FriendRouter;
