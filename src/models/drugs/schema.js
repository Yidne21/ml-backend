import mongoose from 'mongoose';

const drugSchema = new mongoose.Schema(
  {
    name: { type: String },
    drugPhoto: [{ type: String }],
    pharmacyId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Pharmacy',
    },
    category: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    sideEffects: {
      type: String,
      required: true,
    },
    strength: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    stockLevel: { type: Number, default: 0 },
    minStockLevel: { type: Number, required: true },
    needPrescription: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default drugSchema;
