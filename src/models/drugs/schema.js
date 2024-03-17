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
    recivedFrom: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
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
    manufacturedDate: {
      type: Date,
      required: true,
    },
    expiredDate: {
      type: Date,
      required: true,
    },
    stockLevel: { type: Number, required: true },
    minStockLevel: { type: Number, required: true },
    needPrescription: { type: Boolean, required: true, default: false },
  },
  {
    batchNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

export default drugSchema;
