import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    pharmacyId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Pharmacy',
    },
    pharmacyName: {
      type: String,
      required: true,
    },
    drugs: [
      {
        drugId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Drug',
        },
        stockId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Stock',
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        drugName: {
          type: String,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default cartSchema;
