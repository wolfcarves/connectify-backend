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
import { validateSession } from './middleware/auth.middleware';
import { writeDocumentation } from './lib/zodToOpenAPI';
import { corsOptions } from './config/corsOptions';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(validateSession);

renderRoutes(app);
writeDocumentation(app);
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
