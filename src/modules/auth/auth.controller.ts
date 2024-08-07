import type { Request, Response } from 'express';
import {
	userLoginInputSchema,
	userSignupInputSchema,
	UserSignupInput,
} from './auth.schema.ts';
import asyncHandler from '../../utils/asyncHandler.ts';
import * as authService from './auth.service.ts';
import { db } from '@/db/index.ts';
import { userTable } from '@/models/userTable.ts';
import { BadRequestException } from '@/exceptions/BadRequestException.ts';
import hashPassword from '@/utils/hashPassword.ts';
import { lucia } from '@/lib/auth.ts';
import { ForbiddenException } from '@/exceptions/ForbiddenException.ts';

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
	const { username, password } = await userLoginInputSchema.parseAsync(
		req.body,
	);

	const user = await authService.findUserByUsername(username);
	const errorMessage = 'Invalid username or password';

	if (!user) {
		throw new BadRequestException(errorMessage);
	}

	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id).serialize();
	const isPasswordCorrect = await authService.validatePassword(
		password,
		user.password!,
	);

	if (!isPasswordCorrect) {
		throw new BadRequestException(errorMessage);
	}

	res.status(200)
		.appendHeader('Set-Cookie', sessionCookie)
		.appendHeader('Location', '/')
		.json({
			message: 'Login successfully',
		});
});

export const signUpUser = asyncHandler(
	async (
		req: Request<never, never, UserSignupInput, never>,
		res: Response,
	) => {
		const { username, email, password } =
			await userSignupInputSchema.parseAsync(req.body);

		const usernameResults = await authService.findUserByUsername(username);
		const emailResults = await authService.findUserByEmail(email);

		if (usernameResults !== undefined) {
			throw new BadRequestException('Username already exists');
		}

		if (emailResults !== undefined) {
			throw new BadRequestException('Email already exists');
		}

		const hashedPassword = await hashPassword(password);

		await db.insert(userTable).values({
			username,
			email,
			password: hashedPassword,
		});

		res.status(201).json({
			message: 'Signup login successfully!',
		});
	},
);

export const getUserProfile = async (_req: Request, res: Response) => {
	const userId = res.locals.user?.id;

	if (!userId) {
		throw new ForbiddenException('No Authorization');
	}

	const user = await authService.findUserById(userId!);

	res.status(200).json({
		data: user,
	});
};
