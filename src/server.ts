import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import { renderRoutes, renderDocs } from './routes';
import cors from 'cors';
import logger from '@/utils/logger';
import {
	zodErrorHandler,
	errorHandler,
	notFoundHandler,
} from './middleware/error.middleware';
import { corsOptionsDelegate } from './config/corsOptions';
import { validateSession } from './middleware/auth.middleware';
import { writeDocumentation } from './lib/zodToOpenAPI';

const app = express();
const port = process.env.PORT || 5000;

app.options('*', cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(validateSession);

renderRoutes(app);
writeDocumentation();
renderDocs(app);

app.use(zodErrorHandler);
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
	logger.info(`Server is listening on port ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error({
		error: {
			reason,
			promise,
		},
	});
});
