/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from 'express';
import type { UserSignUpInput } from './auth.schema';
import { userLoginInputSchema, userSignUpInputSchema } from './auth.schema';
import * as userService from '../user/user.service';
import * as authService from './auth.service';
import hashPassword from '@/utils/hashPassword';
import { lucia } from '@/lib/auth';
import { ForbiddenException } from '@/exceptions/ForbiddenException';
import { ZodError } from '@/exceptions/ZodError';
import asyncHandler from 'express-async-handler';

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
	const { username, password } = await userLoginInputSchema.parseAsync(
		req.body,
	);

	const user = await userService.getUser({ username });

	const error: ZodError['validationErrors'] = [
		{
			message: 'Invalid username or password',
			path: ['username', 'password'],
		},
	];

	if (!user) {
		throw new ZodError(error);
	}

	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	const isPasswordCorrect = await authService.validatePassword(
		password,
		user.password!,
	);

	if (!isPasswordCorrect) {
		throw new ZodError(error);
	}

	res.appendHeader('Set-Cookie', sessionCookie.serialize())
		.appendHeader('Location', '/')
		.status(200)
		.json({
			success: true,
			message: 'Login successful',
		});
});

export const signUpUser = asyncHandler(
	async (
		req: Request<never, never, UserSignUpInput, never>,
		res: Response,
	) => {
		const parsedData = await userSignUpInputSchema.parseAsync(req.body);

		const usernameResults = await userService.getUser({
			username: parsedData.username,
		});
		const emailResults = await userService.getUser({
			email: parsedData.email,
		});

		const errors: ZodError['validationErrors'] = [];

		if (usernameResults !== undefined) {
			errors.push({
				message: 'Username already exists',
				path: ['username'],
			});
		}

		if (emailResults !== undefined) {
			errors.push({
				message: 'Email already exists',
				path: ['email'],
			});
		}

		if (errors.length > 0) throw new ZodError(errors);

		const hashedPassword = await hashPassword(parsedData.password);

		const data: UserSignUpInput = {
			...parsedData,
			password: hashedPassword,
		};

		await authService.createUser(data);

		res.status(201).json({
			success: true,
			message: 'Signup login successfully!',
		});
	},
);

export const getCurrentSession = asyncHandler(
	async (_req: Request, res: Response) => {
		const userId = res.locals.user?.id;

		if (!userId) {
			throw new ForbiddenException('No Authorization');
		}

		const session = await userService.getUser({
			userId,
		});

		res.status(200).json({
			data: session,
		});
	},
);

export const destroySession = asyncHandler(
	async (_req: Request, res: Response) => {
		const sessionId = String(res.locals.user?.id);

		await lucia.invalidateSession(sessionId);

		const blankSessionCookie = lucia.createBlankSessionCookie();

		res.cookie(blankSessionCookie.name, blankSessionCookie.value, {
			path: '/',
			httpOnly: true,
			maxAge: 0,
			secure: true,
			sameSite: 'none',
		});

		res.status(200).json({
			success: true,
			message: 'Logout successful',
		});
	},
);
