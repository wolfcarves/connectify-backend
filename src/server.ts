import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import type { Request, Response } from 'express';
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
import { initializeSocketIO } from './lib/socket';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = initializeSocketIO(server);

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

io.on('connection', socket => {
	// console.log('User connected', socket.id);

	socket.on('join_room', roomId => {
		console.log('join_room', roomId);
		socket.join(roomId);
	});

	socket.on('send_message', data => {
		socket.to(data?.roomId).emit('receive_message', data.message);
	});

	// socket.on('disconnect', () => {
	// 	console.log('User disconnected');
	// });
});

server.listen(port, '0.0.0.0', () => {
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
