import express from 'express';
import { requireAuth } from '@/middleware/auth.middleware';
import * as PostController from './post.controller';
import * as PostDocumentation from './post.docs';
import multer from 'multer';

const upload = multer({ storage: multer.diskStorage({}) });

const PostRouter = express.Router();

PostDocumentation.createPostDocs();
PostRouter.post(
	'/',
	requireAuth,
	upload.array('images', 10),
	PostController.createPost,
);

PostDocumentation.getUserPostsDocs();
PostRouter.get('/all/:username', requireAuth, PostController.getUserPosts);

PostDocumentation.getUserPostDocs();
PostRouter.get('/:uuid', PostController.getUserPost);

PostDocumentation.deleteUserPostDocs();
PostRouter.delete('/:postId', requireAuth, PostController.deletePost);

PostDocumentation.changeAudienceDocs();
PostRouter.put('/audience/:postId', requireAuth, PostController.changeAudience);

export default PostRouter;
