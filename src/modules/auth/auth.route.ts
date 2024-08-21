import express from 'express';
import * as AuthController from './auth.controller';
import { requireAuth } from '@/middleware/auth.middleware';
import * as AuthDocumentation from './auth.docs';

const AuthRouter = express.Router();

AuthDocumentation.loginUserDocs();
AuthRouter.post('/login', AuthController.loginUser);

AuthDocumentation.signUpUserDocs();
AuthRouter.post('/signup', AuthController.signUpUser);

AuthDocumentation.useGetCurrentSessionDocs();
AuthRouter.get('/session', requireAuth, AuthController.useGetCurrentSession);

AuthDocumentation.deleteSessionDocs();
AuthRouter.delete('/session', requireAuth, AuthController.destroySession);

export default AuthRouter;
