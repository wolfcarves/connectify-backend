'dotenv/config';

import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/db/index';
import { usersTable } from '@/models/usersTable';
import { sessionTable } from '@/models/sessionTable';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, usersTable);

export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(4, 'w'),
	sessionCookie: {
		attributes: {
			secure: false, //process.env.NODE_ENV === 'production', for the meantime while we don't have ssl yet
			sameSite: 'none',
			path: '/',
		},
	},
	getUserAttributes: attr => ({
		username: attr.username,
	}),
});
