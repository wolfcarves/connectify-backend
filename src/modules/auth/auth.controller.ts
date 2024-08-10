import type { Request, Response } from 'express';
import type { UserSignUpInput } from './auth.schema';
import { userLoginInputSchema, userSignUpInputSchema } from './auth.schema';
import asyncHandler from '../../utils/asyncHandler';
import * as authService from './auth.service';
import { db } from '@/db/index';
import { userTable } from '@/models/userTable';
import { BadRequestException } from '@/exceptions/BadRequestException';
import hashPassword from '@/utils/hashPassword';
import { lucia } from '@/lib/auth';
import { ForbiddenException } from '@/exceptions/ForbiddenException';
import { ConflictException } from '@/exceptions/ConflictException';

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
	const { username, password } = await userLoginInputSchema.parseAsync(
		req.body,
	);

	const user = await authService.findUserByUsername(username);
	const errorMessage = 'Invalid username or password';

	if (!user) {
		throw new BadRequestException(errorMessage);
	}

	const session = await lucia.createSession(1, {});
	const sessionCookie = lucia.createSessionCookie(session.id).serialize();
	const isPasswordCorrect = await authService.validatePassword(
		password,
		user.password!,
	);

	if (!isPasswordCorrect) {
		throw new BadRequestException(errorMessage);
	}

	res.cookie('auth-session', sessionCookie, {
		path: '/',
		httpOnly: true,
	});

	res.status(200).json({
		message: 'Login successfully',
	});
});

export const signUpUser = asyncHandler(
	async (
		req: Request<never, never, UserSignUpInput, never>,
		res: Response,
	) => {
		const { username, email, password } =
			await userSignUpInputSchema.parseAsync(req.body);

		const usernameResults = await authService.findUserByUsername(username);
		const emailResults = await authService.findUserByEmail(email);

		if (usernameResults !== undefined) {
			throw new ConflictException('Username already exists');
		}

		if (emailResults !== undefined) {
			throw new ConflictException('Email already exists');
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
