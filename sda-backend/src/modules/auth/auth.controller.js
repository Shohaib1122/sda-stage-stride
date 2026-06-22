import { User } from '../../models/User.model.js';
import bcrypt from 'bcrypt';
import { generateTokens } from '../../utils/jwt.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export const login = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return sendError(res, 'Employee ID and password are required', 400);
    }

    const user = await User.findOne({ employeeId, status: 'active' });
    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);

    // Send refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const userData = {
      _id: user._id,
      employeeId: user.employeeId,
      name: user.name,
      phone: user.phone,
      role: user.role,
      assignedSchools: user.assignedSchools,
      isFirstLogin: user.isFirstLogin,
    };

    return sendSuccess(res, { accessToken, user: userData }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 'Internal server error', 500);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    return sendSuccess(res, null, 'Logout successful');
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).populate('assignedSchools', 'name slug logoUrl');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const userData = {
      _id: user._id,
      employeeId: user.employeeId,
      name: user.name,
      phone: user.phone,
      role: user.role,
      assignedSchools: user.assignedSchools,
    };

    return sendSuccess(res, userData);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};
