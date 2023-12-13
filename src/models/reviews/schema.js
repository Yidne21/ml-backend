import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewedBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    pharmacyId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Pharmacy',
    },
    rating: { type: Number, required: true },
    feedback: { type: String },
  },
  { timestamps: true }
);

export default reviewSchema;
