import type { CorsOptionsDelegate } from 'cors';

const whitelist = ['http://localhost:3000'];

export const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
	let corsOptions;

	if (whitelist.indexOf('Origin') !== -1) corsOptions = { origin: true };
	else corsOptions = { origin: false };

	callback(null, corsOptions);
};
