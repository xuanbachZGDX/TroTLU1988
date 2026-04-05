import express from 'express';
import * as postController from '../controllers/postController.js';

const router = express.Router();

router.get('/all', postController.getPosts);
router.get('/limit', postController.getPostsLimit);

export default router;