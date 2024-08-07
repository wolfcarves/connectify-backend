import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/db/index.ts';
import { userTable } from '@/models/userTable.ts';
import { sessionTable } from '@/models/sessionTable.ts';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(4, 'w'),
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getUserAttributes: attr => ({
		username: attr.username,
	}),
});
