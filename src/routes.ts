import { type Express } from 'express';
import OpenAPIDocs from './docs/openapi-docs.json' assert { type: 'json' };
import SwaggerUI from 'swagger-ui-express';
import AuthRouter from './modules/auth/auth.route';
import HealthRouter from './modules/health/health.route';
import PostRouter from './modules/post/post.route';
import express from 'express';

const apiRouter = express.Router();
const apiPrefix = '/api/v1';

export const renderRoutes = (app: Express) => {
	apiRouter.use('/auth', AuthRouter);
	apiRouter.use('/health', HealthRouter);
	apiRouter.use('/post', PostRouter);

	app.use(apiPrefix, apiRouter);
};

export const renderDocs = (app: Express) => {
	app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(OpenAPIDocs));
};
