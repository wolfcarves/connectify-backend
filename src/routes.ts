import 'dotenv/config';

import type { Express, Request, Response } from 'express';
import OpenAPIDocs from './docs/openapi-docs.json' assert { type: 'json' };
import SwaggerUI from 'swagger-ui-express';
import AuthRouter from './modules/auth/auth.route';
import FriendRouter from './modules/friend/friend.route';
import HealthRouter from './modules/health/health.route';
import PostRouter from './modules/post/post.route';
import EngagementRouter from './modules/engagement/engagement.route';
import UserRouter from './modules/user/user.route';
import express from 'express';
import { env } from './config/env';

const apiRouter = express.Router();
const apiPrefix = '/api/v1';

export const renderRoutes = (app: Express) => {
	apiRouter.use('/auth', AuthRouter);
	apiRouter.use('/friends', FriendRouter);
	apiRouter.use('/health', HealthRouter);
	apiRouter.use('/post', PostRouter);
	apiRouter.use('/engagement', EngagementRouter);
	apiRouter.use('/user', UserRouter);

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
