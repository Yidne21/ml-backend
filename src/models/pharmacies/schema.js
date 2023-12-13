import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    pharmaciestId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    about: { type: String },
    logo: { type: String },
    cover: { type: String },
    workingHours: { type: String },
    address: { type: String },
    socialMedia: {
      linkedIn: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      telegram: { type: String },
    },
  },
  { timestamps: true }
);

export default pharmacySchema;
