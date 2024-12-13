import { NotFoundException } from '@/exceptions/NotFoundException';
import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as SocketIOServerType } from 'socket.io';

let io: SocketIOServerType | null = null;

export const initializeSocketIO = (server: HttpServer) => {
	io = new SocketIOServer(server, {
		cors: {
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST'],
		},
	});

	return io;
};

export const socketIO = (): SocketIOServerType => {
	if (!io) {
		throw new NotFoundException('Socket IO not initialized');
	}

	return io;
};
