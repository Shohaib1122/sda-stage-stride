import { User } from '../../models/User.model.js';
import { School } from '../../models/School.model.js';
import bcrypt from 'bcrypt';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

// Instructors Management
export const createInstructor = async (req, res) => {
  try {
    const { employeeId, name, phone, password, role, schools, status } = req.body;

    const existingUser = await User.findOne({ employeeId });
    if (existingUser) return sendError(res, 'Employee ID already exists', 400);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      employeeId,
      name,
      phone,
      passwordHash,
      role: role || 'instructor',
      assignedSchools: schools || [],
      status: status || 'active',
    });

    const userData = user.toObject();
    delete userData.passwordHash;

    return sendSuccess(res, userData, 'Instructor created successfully', 201);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, role, schools, status } = req.body;

    const user = await User.findById(id);
    if (!user) return sendError(res, 'Instructor not found', 404);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (schools) user.assignedSchools = schools;
    if (status) user.status = status;

    await user.save();
    
    const userData = user.toObject();
    delete userData.passwordHash;

    return sendSuccess(res, userData, 'Instructor updated successfully');
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const toggleInstructorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-passwordHash');
    if (!user) return sendError(res, 'Instructor not found', 404);

    return sendSuccess(res, user, `Instructor status changed to ${status}`);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id); // For production, you might want to soft delete
    return sendSuccess(res, null, 'Instructor deleted successfully');
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const resetInstructorPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return sendError(res, 'Password must be at least 6 characters', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { passwordHash, isFirstLogin: true });

    return sendSuccess(res, null, 'Password reset successfully');
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

// Schools Management
export const createSchool = async (req, res) => {
  try {
    const { slug, name, accessCode, logoUrl, sections, address, isActive } = req.body;

    const existingSchool = await School.findOne({ slug });
    if (existingSchool) return sendError(res, 'School slug already exists', 400);

    const accessCodeHash = await bcrypt.hash(accessCode.trim().toUpperCase(), 10);

    const school = await School.create({
      slug,
      name,
      accessCodeHash,
      logoUrl,
      sections: sections || [],
      address,
      isActive: isActive !== undefined ? isActive : true,
    });

    return sendSuccess(res, school, 'School created successfully', 201);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, name, logoUrl, sections, address, isActive } = req.body;

    const updateData = {};
    if (slug) updateData.slug = slug;
    if (name) updateData.name = name;
    if (logoUrl) updateData.logoUrl = logoUrl;
    if (sections) updateData.sections = sections;
    if (address) updateData.address = address;
    if (isActive !== undefined) updateData.isActive = isActive;

    const school = await School.findByIdAndUpdate(id, updateData, { new: true });
    if (!school) return sendError(res, 'School not found', 404);

    return sendSuccess(res, school, 'School updated successfully');
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const rotateSchoolCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCode } = req.body;

    if (!newCode || newCode.length < 4) {
      return sendError(res, 'New code must be at least 4 characters', 400);
    }

    const accessCodeHash = await bcrypt.hash(newCode.trim().toUpperCase(), 10);
    await School.findByIdAndUpdate(id, { accessCodeHash });

    return sendSuccess(res, null, 'School code rotated successfully');
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};
