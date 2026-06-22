import express from 'express';
import { login, logout, getMe } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
