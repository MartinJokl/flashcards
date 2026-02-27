import express from 'express';
import { getAllSets, getSet, createSet, updateSet, deleteSet } from '../controllers/sets.ts';
import AuthMiddleware from '../middleware/auth.ts';

const router = express.Router();

router.route('/').get(getAllSets).post(AuthMiddleware, createSet);
router.route('/:id').get(getSet).patch(AuthMiddleware, updateSet).delete(AuthMiddleware, deleteSet);

export default router;