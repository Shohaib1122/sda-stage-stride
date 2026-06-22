import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/apiResponse.js';

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded; // { sub, employeeId, role, assignedSchools, schoolId (if principal) }
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};
