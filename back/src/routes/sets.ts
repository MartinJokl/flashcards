import express from 'express';
import { getAllSets, getSet, createSet, updateSet, deleteSet } from '../controllers/sets.ts';

const router = express.Router();

router.route('/').get(getAllSets).post(createSet);
router.route('/:id').get(getSet).patch(updateSet).delete(deleteSet);

export default router;