import 'dotenv/config';

import type { Express, Request, Response } from 'express';
import OpenAPIDocs from './docs/openapi-docs.json' assert { type: 'json' };
import SwaggerUI from 'swagger-ui-express';
import AuthRouter from './modules/auth/auth.route';
import BookmarkRouter from './modules/bookmark/bookmark.route';
import ChatRouter from './modules/chat/chat.route';
import CommentRouter from './modules/comment/comment.route';
import FeedRouter from './modules/feed/feed.route';
import FriendRouter from './modules/friend/friend.route';
import HealthRouter from './modules/health/health.route';
import LikeRouter from './modules/like/like.route';
import PostRouter from './modules/post/post.route';
import UserRouter from './modules/user/user.route';
import express from 'express';
import { env } from './config/env';

const apiRouter = express.Router();
const apiPrefix = '/api/v1';

export const renderRoutes = (app: Express) => {
	apiRouter.use('/auth', AuthRouter);
	apiRouter.use('/bookmark', BookmarkRouter);
	apiRouter.use('/comment', CommentRouter);
	apiRouter.use('/chats', ChatRouter);
	apiRouter.use('/feed', FeedRouter);
	apiRouter.use('/friends', FriendRouter);
	apiRouter.use('/health', HealthRouter);
	apiRouter.use('/like', LikeRouter);
	apiRouter.use('/post', PostRouter);
	apiRouter.use('/users', UserRouter);

	apiRouter.get('/health', (req: Request, res: Response) => {
		res.status(200).send({
			someUri: `uri is ${env?.databaseUri}`,
			message: `Server is up and runing in ${process.env.PORT}`,
		});
	});

	app.use(apiPrefix, apiRouter);
};

export const renderDocs = (app: Express) => {
	app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(OpenAPIDocs));
};
