import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    profilePicture: { type: String },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
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
