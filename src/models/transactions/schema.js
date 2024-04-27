import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: 'Order',
    },
    senderAccount: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      bankCode: { type: String },
      accountType: { type: String },
    },
    receiverAccount: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      bankCode: { type: String },
      accountType: { type: String },
    },
    amount: { type: Number, required: true },
    tx_ref: { type: String, required: true },
    reason: {
      type: String,
      enum: ['order-payment', 'pharmacy-payment', 'refund'],
      default: 'order-payment',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true }
);

export default transactionSchema;
