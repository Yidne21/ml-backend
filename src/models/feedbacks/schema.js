import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['complaint', 'suggestion', 'question'],
    },
    replayedTo: { type: mongoose.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'replayed', 'closed'],
      default: 'pending',
    },
    feedbackId: { type: mongoose.Types.ObjectId, ref: 'Feedback' },
  },
  { timestamps: true }
);

export default feedbackSchema;
