import { UnauthorizedException } from '@/exceptions/UnauthorizedException';
import type { CorsOptions } from 'cors';

const whitelist = [
	'http://localhost:3000',
	'http://localhost:5000',
	'https://connectify-frontend-tau.vercel.app',
];

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin!) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new UnauthorizedException('Not allowed by CORS'));
		}
	},
	credentials: true,
};
