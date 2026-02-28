import express from 'express';
import { getAllSets, getSet, createSet, updateSet, deleteSet, likeSet, unlikeSet } from '../controllers/sets.ts';
import authMiddleware from '../middleware/auth.ts';

const router = express.Router();

router.route('/').get(getAllSets).post(authMiddleware, createSet);
router.route('/:id').get(getSet).patch(authMiddleware, updateSet).delete(authMiddleware, deleteSet);
router.route('/like/:id').post(authMiddleware, likeSet).delete(authMiddleware, unlikeSet);

export default router;