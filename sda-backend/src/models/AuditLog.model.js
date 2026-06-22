import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedByRole: {
      type: String,
    },
    targetCollection: {
      type: String,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    changesSummary: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Logs only need creation time
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
