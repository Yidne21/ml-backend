import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    address: {
      type: String,
    },
    avatar: {
      type: String,
      default: 'https://fakeimg.pl/150x150/bdbdbd/ffffff?text=avatar&font=noto',
    },
    coverPhoto: {
      type: String,
      default:
        'https://fakeimg.pl/400x200/bdbdbd/ffffff?text=Cover+Photo&font=noto',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    deliveryAddress: [
      {
        address: { type: String },
        phoneNumber: { type: String },
        location: {
          type: {
            type: String,
            enum: ['Point'],
          },
          coordinates: {
            type: [Number],
          },
        },
      },
    ],
    pharmacistLicense: { type: String },
    emailVerified: { type: Boolean, default: false, required: true },
    role: {
      type: String,
      enum: ['admin', 'pharmacist', 'customer', 'superAdmin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deactivated'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default userSchema;
