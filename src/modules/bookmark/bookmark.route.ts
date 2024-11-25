import express from 'express';
import * as BookmarkController from './bookmark.controller';
import * as BookmarkDocumentation from './bookmark.docs';
import { requireAuth } from '@/middleware/auth.middleware';

const BookmarkRouter = express.Router();

BookmarkDocumentation.getBookmarksDocs();
BookmarkRouter.get('/posts', BookmarkController.getBookmarks);

BookmarkDocumentation.saveUserPostDocs();
BookmarkRouter.post(
	'/post/save/:postId',
	requireAuth,
	BookmarkController.savePost,
);

BookmarkDocumentation.unSaveUserPostDocs();
BookmarkRouter.post(
	'/post/unsave/:postId',
	requireAuth,
	BookmarkController.usSavePost,
);

export default BookmarkRouter;
