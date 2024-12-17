import express from 'express';
import multer from 'multer';
import * as UserController from './user.controller';
import * as UserDocumentation from './user.docs';
import { requireAuth } from '@/middleware/auth.middleware';

const upload = multer({ storage: multer.diskStorage({}) });
const UserRouter = express.Router();

UserDocumentation.getUserProfileDocs();
UserRouter.get('/profile', requireAuth, UserController.getUserProfile);

UserDocumentation.getUsersDocs();
UserRouter.get('/', requireAuth, UserController.getUsers);

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

export default UserRouter;
