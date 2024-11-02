import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { renderRoutes, renderDocs } from './routes';
import helmet from 'helmet';
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
import cloudinary from 'cloudinary';
import { cloudinaryOptions } from './config/cloundinaryOptions';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.v2.config(cloudinaryOptions);

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
