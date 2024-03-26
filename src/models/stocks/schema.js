import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    drugId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Drug',
    },
    price: { type: String, required: true },
    cost: { type: String, required: true },
    recievedFrom: {
      type: String,
      required: true,
    },
    expiredDate: {
      type: Date,
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export default stockSchema;
