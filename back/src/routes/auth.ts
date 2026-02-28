import express from 'express';
import { login, createAccount } from '../controllers/auth.ts'

const router = express.Router();

router.post('/login', login);
router.route('/').post(createAccount);

export default router;