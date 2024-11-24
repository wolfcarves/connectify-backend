import express from 'express';
import { requireAuth } from '@/middleware/auth.middleware';
import * as PostController from './post.controller';
import * as PostDocumentation from './post.docs';

const PostRouter = express.Router();

PostDocumentation.createPostDocs();
PostRouter.post('/', requireAuth, PostController.createPost);

PostDocumentation.getUserPostsDocs();
PostRouter.get('/all/:username', requireAuth, PostController.getUserPosts);

PostDocumentation.getUserPostDocs();
PostRouter.get('/:uuid', PostController.getUserPost);

PostDocumentation.deleteUserPostDocs();
PostRouter.delete('/:postId', requireAuth, PostController.deletePost);

PostDocumentation.saveUserPostDocs();
PostRouter.post('/save/:postId', requireAuth, PostController.savePost);

PostDocumentation.unSaveUserPostDocs();
PostRouter.post('/unsave/:postId', requireAuth, PostController.usSavePost);

export default PostRouter;
