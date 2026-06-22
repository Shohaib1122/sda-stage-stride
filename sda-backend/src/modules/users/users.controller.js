import { User } from '../../models/User.model.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export const getUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    let query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query).select('-passwordHash').populate('assignedSchools', 'name slug');
    return sendSuccess(res, users);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash').populate('assignedSchools', 'name slug');
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, user);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};
