import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    receiver: {
      type: mongoose.Types.ObjectId,
      required: true,
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
      branchName: { type: String },
      accountType: { type: String },
    },
    receiverAccount: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      branchName: { type: String },
      accountType: { type: String },
    },
    amount: { type: Number, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true }
);

export default transactionSchema;
