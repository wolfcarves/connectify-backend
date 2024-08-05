import express from 'express';
import * as AuthController from './auth.controller.ts';

const AuthRouter = express.Router();

AuthRouter.post('/login', AuthController.loginUser);
AuthRouter.post('/signup', AuthController.signUpUser);

export default AuthRouter;
