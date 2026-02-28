import express from 'express';
import { login, getAccount, createAccount, updateAccount, deleteAccount } from '../controllers/accounts.ts'
import AuthMiddleware from '../middleware/auth.ts';

const router = express.Router();

router.post('/login', login);
router.route('/').post(createAccount).patch(AuthMiddleware, updateAccount).delete(AuthMiddleware, deleteAccount);
router.route('/api/:id').get(getAccount)

export default router;