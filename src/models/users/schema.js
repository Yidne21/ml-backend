import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    role: {
      type: String,
      enum: ['admin', 'pharmaciest', 'customer'],
      required: true,
    },
  },
  { timestamps: true }
);

export default userSchema;
