import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderedTo: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Pharmacy',
    },
    orderedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    deliveryAddress: {
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
    drugId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Drug',
    },
    stockId: {
      type: mongoose.Types.ObjectId,
      ref: 'Stock',
    },
    deliveryExpireDate: {
      type: Date,
    },
    quantity: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        'inprogress',
        'delivered',
        'expired',
        'rejected',
        'pending',
        'refunded',
      ],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true }
);

export default orderSchema;
