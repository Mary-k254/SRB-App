import { Router } from 'express';
import { createComment, getComments } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createComment);
router.get('/', getComments);

export default router;
