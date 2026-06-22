import { School } from '../../models/School.model.js';
import bcrypt from 'bcrypt';
import { generatePrincipalToken } from '../../utils/jwt.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export const getSchools = async (req, res) => {
  try {
    const schools = await School.find({ isActive: true }).select('-accessCodeHash');
    return sendSuccess(res, schools);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).select('-accessCodeHash');
    if (!school) {
      return sendError(res, 'School not found', 404);
    }
    return sendSuccess(res, school);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    const { id } = req.params;

    if (!code) {
      return sendError(res, 'School code is required', 400);
    }

    const school = await School.findById(id);
    if (!school || !school.isActive) {
      return sendError(res, 'School not found or inactive', 404);
    }

    const normalizedCode = code.trim().toUpperCase();
    const isMatch = await bcrypt.compare(normalizedCode, school.accessCodeHash);

    if (!isMatch) {
      return sendError(res, 'Invalid school code', 401);
    }

    // Issue Principal JWT
    const token = generatePrincipalToken(school._id);
    
    // Convert to plain object and remove sensitive data manually since toJSON is handled in model
    const schoolData = school.toJSON();

    return sendSuccess(res, { valid: true, token, school: schoolData }, 'Verification successful');
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};
