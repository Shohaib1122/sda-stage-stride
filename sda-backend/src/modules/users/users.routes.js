import express from 'express';
import { getUsers, getUserById } from './users.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/authorize.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(['admin']));

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
