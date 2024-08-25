import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/db/index';
import { userTable } from '@/models/userTable';
import { sessionTable } from '@/models/sessionTable';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(4, 'w'),
	sessionCookie: {
		attributes: {
			secure: false, //process.env.NODE_ENV === 'production', for the meantime while we don't have ssl yet
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			path: '/',
			domain:
				process.env.NODE_ENV === 'production'
					? 'http://172.104.163.183'
					: 'http://localhost:5000',
		},
	},
	getUserAttributes: attr => ({
		username: attr.username,
	}),
});
