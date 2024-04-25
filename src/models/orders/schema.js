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
    drugs: [
      {
        drugId: {
          type: mongoose.Types.ObjectId,
          ref: 'Drug',
        },
        stockId: {
          type: mongoose.Types.ObjectId,
          ref: 'Stock',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        drugName: {
          type: String,
          required: true,
        },
      },
    ],
    deliveryExpireDate: {
      type: Date,
    },
    quantity: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    hasDelivery: {
      type: Boolean,
      default: false,
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
