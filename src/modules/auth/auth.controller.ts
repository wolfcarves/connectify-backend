import type { Request, Response } from 'express';

export const loginUser = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'User login successfully!',
  });
};

export const signUpUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Signup login successfully!',
  });
};
