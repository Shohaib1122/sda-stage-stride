import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['instructor', 'senior-instructor', 'admin'],
      required: true,
    },
    assignedSchools: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
