import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    drug: [
      {
        drugId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Drug',
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
  },
  { timestamps: true }
);

export default cartSchema;
