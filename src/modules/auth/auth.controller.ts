import type { Request, Response } from 'express';
import { userSignupInput, UserSignupInput } from './auth.model.ts';
import asyncHandler from 'express-async-handler';
import { findUserByEmail, findUserByUsername } from './auth.service.ts';
import { db } from '@/db/index.ts';
import { users } from '@/models/users.ts';
import { BadRequestException } from '@/exceptions/BadRequestException.ts';

export const loginUser = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'User login successfully!',
  });
};

export const signUpUser = asyncHandler(
  async (req: Request<never, never, UserSignupInput, never>, res: Response) => {
    const parsedInput = await userSignupInput.parseAsync(req.body);

    const { username, email } = parsedInput;

    const usernameResults = await findUserByUsername(username);
    const emailResults = await findUserByEmail(email);

    if (usernameResults.length > 0) {
      throw new BadRequestException('Username already exists');
    }

    if (emailResults.length > 0) {
      throw new BadRequestException('Email already exists');
    }

    await db.insert(users).values(parsedInput);

    res.status(201).json({
      message: 'Signup login successfully!',
    });
  },
);
