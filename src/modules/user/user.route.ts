import express from 'express';
import multer from 'multer';
import * as UserController from './user.controller';
import * as UserDocumentation from './user.docs';
import { requireAuth } from '@/middleware/auth.middleware';
import { storage } from '@/config/multerStorageOptions';

const upload = multer({ storage });
const UseRouter = express.Router();

UserDocumentation.uploadUserProfileImageDocs();
UseRouter.post(
	'/profile/avatar',
	requireAuth,
	upload.single('avatar'),
	UserController.uploadUserProfileImage,
);

UseRouter.delete(
	'/profile/avatar',
	requireAuth,
	UserController.deleteUserProfileImage,
);

export default UseRouter;
