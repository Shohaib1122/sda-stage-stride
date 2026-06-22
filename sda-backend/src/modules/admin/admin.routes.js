import express from 'express';
import { 
  createInstructor, updateInstructor, toggleInstructorStatus, deleteInstructor, resetInstructorPassword,
  createSchool, updateSchool, rotateSchoolCode 
} from './admin.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/authorize.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(['admin']));

// Instructors
router.post('/instructors', createInstructor);
router.put('/instructors/:id', updateInstructor);
router.patch('/instructors/:id/status', toggleInstructorStatus);
router.delete('/instructors/:id', deleteInstructor);
router.post('/instructors/:id/reset-password', resetInstructorPassword);

// Schools
router.post('/schools', createSchool);
router.put('/schools/:id', updateSchool);
router.post('/schools/:id/rotate-code', rotateSchoolCode);

export default router;
