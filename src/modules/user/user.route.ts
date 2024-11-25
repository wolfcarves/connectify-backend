import express from 'express';
import multer from 'multer';
import * as UserController from './user.controller';
import * as UserDocumentation from './user.docs';
import { requireAuth } from '@/middleware/auth.middleware';

const upload = multer({ storage: multer.diskStorage({}) });
const UserRouter = express.Router();

UserDocumentation.uploadUserProfileImageDocs();
UserRouter.post(
	'/profile/avatar',
	requireAuth,
	upload.single('avatar'),
	UserController.uploadUserProfileImage,
);

UserDocumentation.deleteUserProfileImageDocs();
UserRouter.delete(
	'/profile/avatar',
	requireAuth,
	UserController.deleteUserProfileImage,
);

UserDocumentation.getUserProfileDocs();
UserRouter.get('/profile', requireAuth, UserController.getUserProfile);

export default UserRouter;
