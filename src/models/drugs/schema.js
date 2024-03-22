import mongoose from 'mongoose';

const drugSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
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
    strengthAndDosage: {
      type: String,
      required: true,
    },
    stockLevel: { type: Number, required: true },
    minStockLevel: { type: Number, required: true },
    needPrescription: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default drugSchema;
