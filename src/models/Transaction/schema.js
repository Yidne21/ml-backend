import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    receiver: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    senderAccountId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User.account',
    },
    receiverAccountId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User.account',
    },
    reason: { type: String },
  },
  { timestamps: true }
);

export default transactionSchema;
