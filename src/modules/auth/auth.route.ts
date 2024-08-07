import express from 'express';
import * as AuthController from './auth.controller.ts';
import { requireAuth } from '@/middleware/auth.middleware.ts';

const AuthRouter = express.Router();

AuthRouter.post('/test', requireAuth, (req, res) => {
	res.send({ user: res.locals.user });
});
AuthRouter.post('/login', AuthController.loginUser);
AuthRouter.post('/signup', AuthController.signUpUser);
AuthRouter.post('/profile', requireAuth, AuthController.loginUser);

export default AuthRouter;
