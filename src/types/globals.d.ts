import { lucia } from '@/lib/auth';

interface User {
	id: number;
	username: string;
}

declare global {
	namespace Express {
		interface Locals {
			user: User | null;
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
