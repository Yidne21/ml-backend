import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
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
    pharmaciestLicense: { type: String },
    emailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['admin', 'pharmacist', 'customer', 'superAdmin'],
      required: true,
    },
  },
  { timestamps: true }
);

export default userSchema;
