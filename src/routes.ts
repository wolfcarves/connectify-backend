import { type Express } from 'express';
import AuthRouter from './modules/auth/auth.route';
import SwaggerUI from 'swagger-ui-express';
import OpenAPIDocs from './docs/openapi-docs.json' assert { type: 'json' };

export const renderRoutes = (app: Express) => {
	app.use('/auth', AuthRouter);
};

export const renderDocs = (app: Express) => {
	app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(OpenAPIDocs));
};
