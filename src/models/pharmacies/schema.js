import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String, required: true },
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
    pharmacistId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
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
    pharmacyLicense: { type: String, required: true },
    deliveryPricePerKm: { type: Number, default: 0 },
    deliveryCoverage: { type: Number, default: 0 },
    hasDeliveryService: { type: Boolean, default: false },
    minDeliveryTime: { type: Number, default: 0 },
    maxDeliveryTime: { type: Number, default: 0 },
    status: {
      type: String,
      default: 'unassigned',
      enum: ['pending', 'approved', 'rejected', 'deactivated', 'unassigned'],
    },
    account: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      branchName: { type: String },
      accountType: { type: String },
      bankCode: { type: String },
    },
    avgRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default pharmacySchema;
