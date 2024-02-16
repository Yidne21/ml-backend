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
    transactionId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Transaction',
    },
    deliveredAt: {
      type: Date,
    },
    abortedAt: {
      type: Date,
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    quantity: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['inprogress', 'delivered', 'aborted'],
      default: 'inprogress',
      required: true,
    },
  },
  { timestamps: true }
);

export default orderSchema;
