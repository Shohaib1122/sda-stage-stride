import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateTokens = (user) => {
  const payload = {
    sub: user._id,
    employeeId: user.employeeId,
    role: user.role,
    assignedSchools: user.assignedSchools.map(s => s.toString()),
  };

  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user._id }, env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

export const generatePrincipalToken = (schoolId) => {
  const payload = {
    role: 'principal',
    schoolId: schoolId.toString(),
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '8h' });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
