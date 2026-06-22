import { sendError } from '../utils/apiResponse.js';

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: Insufficient permissions', 403);
    }
    next();
  };
};

export const requireSchoolAccess = (req, res, next) => {
  // If Admin, they have access to all schools
  if (req.user.role === 'admin') {
    return next();
  }

  // If Principal, they have access to the school in their token
  if (req.user.role === 'principal') {
    if (req.query.schoolId !== req.user.schoolId && req.params.schoolId !== req.user.schoolId && req.body.schoolId !== req.user.schoolId) {
      return sendError(res, 'Forbidden: Invalid school access for principal', 403);
    }
    return next();
  }

  // If Instructor/Senior-Instructor, check assignedSchools
  const targetSchoolId = req.query.schoolId || req.params.schoolId || req.body.schoolId;
  if (!targetSchoolId) {
    return sendError(res, 'Bad Request: schoolId is required for this operation', 400);
  }

  if (!req.user.assignedSchools.includes(targetSchoolId)) {
    return sendError(res, 'Forbidden: You are not assigned to this school', 403);
  }

  next();
};
