import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    warmup: { type: String, default: '' },
    followUp: { type: String, default: '' },
    choreography: { type: String, default: '' },
    song: { type: String, default: '' },
    skill: { type: String, default: '' },
    other: { type: String, default: '' },
    trainer: { type: String, default: '' },
    remarks: { type: String, default: '' },
  }
);

const syllabusSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    entries: [entrySchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

syllabusSchema.index({ schoolId: 1, section: 1, grade: 1, month: 1, year: 1 }, { unique: true });

export const Syllabus = mongoose.model('Syllabus', syllabusSchema);
