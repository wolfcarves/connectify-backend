import type { lucia } from '@/lib/auth';
import type { Server as SocketIOServer } from 'socket.io';

interface User {
	id: number;
	username: string;
}

declare global {
	namespace Express {
		interface Locals {
			user: User | null;
		}

		export interface Request {
			io?: SocketIOServer;
		}
	}
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		UserId: number;
		DatabaseUserAttributes: Omit<User, 'id'>;
	}
}
