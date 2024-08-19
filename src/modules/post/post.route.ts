import express from 'express';
import { requireAuth } from '@/middleware/auth.middleware';
import * as PostController from './post.controller';
import * as PostDocumentation from './post.docs';

const PostRouter = express.Router();

PostDocumentation.createPostDocs();
PostRouter.post('/', requireAuth, PostController.createPost);

PostDocumentation.getUserPostsDocs();
PostRouter.get('/all/:userId', PostController.getPosts);

PostDocumentation.getUserPostDocs();
PostRouter.get('/:postId', PostController.getPost);

PostRouter.delete('/:postId', requireAuth, PostController.deletePost);

export default PostRouter;
