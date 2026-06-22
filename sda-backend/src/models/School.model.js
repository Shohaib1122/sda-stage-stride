import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    grades: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  { _id: false }
);

const schoolSchema = new mongoose.Schema(
  {
    slug: {
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
    accessCodeHash: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    sections: [sectionSchema],
    address: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Do not return accessCodeHash by default
schoolSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.accessCodeHash;
  return obj;
};

export const School = mongoose.model('School', schoolSchema);
