import express from 'express';
import { getSchools, getSchoolById, verifyCode } from './schools.controller.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 requests per IP
  message: { success: false, message: 'Too many verification attempts, please try again after 10 minutes' }
});

router.get('/', getSchools);
router.get('/:id', getSchoolById);
router.post('/:id/verify-code', verifyLimiter, verifyCode);

export default router;
