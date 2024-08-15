import express from 'express';
import * as PostController from './post.controller';
import { requireAuth } from '@/middleware/auth.middleware';
import * as PostDocumentation from './post.docs';

const PostRouter = express.Router();

PostDocumentation.createPostDocs();
PostRouter.post('/', requireAuth, PostController.createPost);

PostDocumentation.getUserPostDocs();
PostRouter.get('/:postId', requireAuth, PostController.getUserPost);

PostDocumentation.getUserPostsDocs();
PostRouter.get('/all/:userId', requireAuth, PostController.getUserPosts);

PostRouter.delete('/:postId', requireAuth, PostController.deletePost);

export default PostRouter;
