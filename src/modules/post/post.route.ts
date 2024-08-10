import express from 'express';
import { createPost } from './post.controller';
import { requireAuth } from '@/middleware/auth.middleware';

const PostRouter = express.Router();

PostRouter.post('/create', requireAuth, createPost);
