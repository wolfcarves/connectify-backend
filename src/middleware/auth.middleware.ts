import { ForbiddenException } from '@/exceptions/ForbiddenException.ts';
import { lucia } from '@/lib/auth.ts';
import { NextFunction, Request, Response } from 'express';

export const validateSession = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');

	if (!sessionId) {
		res.locals.user = null;
		res.locals.session = null;

		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session && session?.fresh) {
		res.appendHeader(
			'Set-Cookie',
			lucia.createSessionCookie(session.id).serialize(),
		);
	}

	if (!session) {
		res.appendHeader(
			'Set-Cookie',
			lucia.createBlankSessionCookie().serialize(),
		);
	}

	res.locals.user = user;
	res.locals.session = session;

	return next();
};

export const requireAuth = (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = res.locals.user;

	if (!user) throw new ForbiddenException('Not Authorized');

	next();
};
