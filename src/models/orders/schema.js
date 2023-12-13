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
    drugId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Drug',
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    deliveredAt: {
      type: Date,
    },
    quantity: {
      type: Number,
    },
    profit: { type: Number },
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
