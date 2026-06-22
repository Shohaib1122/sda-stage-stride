import { Syllabus } from '../../models/Syllabus.model.js';
import { AuditLog } from '../../models/AuditLog.model.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export const getSyllabus = async (req, res) => {
  try {
    const { schoolId, section, grade, month, year } = req.query;

    if (!schoolId || !section || !grade || !month || !year) {
      return sendError(res, 'Missing required query parameters', 400);
    }

    const syllabus = await Syllabus.findOne({ schoolId, section, grade, month, year });
    
    if (!syllabus) {
      return sendSuccess(res, { entries: [] });
    }

    return sendSuccess(res, syllabus);
  } catch (error) {
    return sendError(res, 'Internal server error', 500);
  }
};

export const createOrUpdateSyllabus = async (req, res) => {
  try {
    const { schoolId, section, grade, month, year, entries } = req.body;

    if (!schoolId || !section || !grade || !month || !year || !entries) {
      return sendError(res, 'Missing required fields', 400);
    }

    let syllabus = await Syllabus.findOne({ schoolId, section, grade, month, year });

    if (syllabus) {
      syllabus.entries = entries;
      syllabus.lastUpdatedBy = req.user.sub;
      await syllabus.save();

      await AuditLog.create({
        action: 'syllabus.update',
        performedBy: req.user.sub,
        performedByRole: req.user.role,
        targetCollection: 'syllabus',
        targetId: syllabus._id,
        changesSummary: `Updated syllabus for ${grade} - ${month} ${year}`,
        ipAddress: req.ip,
      });
    } else {
      syllabus = await Syllabus.create({
        schoolId,
        section,
        grade,
        month,
        year,
        entries,
        createdBy: req.user.sub,
        lastUpdatedBy: req.user.sub,
      });

      await AuditLog.create({
        action: 'syllabus.create',
        performedBy: req.user.sub,
        performedByRole: req.user.role,
        targetCollection: 'syllabus',
        targetId: syllabus._id,
        changesSummary: `Created syllabus for ${grade} - ${month} ${year}`,
        ipAddress: req.ip,
      });
    }

    return sendSuccess(res, syllabus, 'Syllabus saved successfully');
  } catch (error) {
    console.error(error);
    return sendError(res, 'Internal server error', 500);
  }
};
