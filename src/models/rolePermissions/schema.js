import mongoose from 'mongoose';

const grantListSchema = new mongoose.Schema(
  {
    role: { type: [String], required: true },
    resource: { type: [String], required: true },
    action: { type: String, required: true },
    attributes: { type: [String], required: true, default: ['*'] },
  },
  {
    timestamps: true,
  }
);

export default grantListSchema;
