import type { Request, Response } from 'express';
import { userSignupInput, UserSignupInput } from './auth.model.ts';
import asyncHandler from 'express-async-handler';

export const loginUser = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'User login successfully!',
  });
};

export const signUpUser = asyncHandler(
  async (req: Request<never, never, UserSignupInput, never>, res: Response) => {
    const { username, email, password, confirm_password } =
      await userSignupInput.parseAsync(req.body);

    res.status(200).json({
      message: 'Signup login successfully!',
    });
  },
);
