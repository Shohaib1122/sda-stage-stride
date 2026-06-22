import express from 'express';
import { getSyllabus, createOrUpdateSyllabus } from './syllabus.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireSchoolAccess } from '../../middleware/authorize.js';

const router = express.Router();

router.get('/', requireAuth, requireSchoolAccess, getSyllabus);
router.post('/', requireAuth, requireSchoolAccess, createOrUpdateSyllabus);
router.put('/:id', requireAuth, requireSchoolAccess, createOrUpdateSyllabus); // Simplified for now, uses same logic

export default router;
