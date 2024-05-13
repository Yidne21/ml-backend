import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderedTo: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Pharmacy',
    },
    orderedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    deliveryAddress: {
      address: { type: String },
      phoneNumber: { type: String },
      location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        },
      },
    },
    drugs: [
      {
        drugId: {
          type: mongoose.Types.ObjectId,
          ref: 'Drug',
        },
        stockId: {
          type: mongoose.Types.ObjectId,
          ref: 'Stock',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
        drugName: {
          type: String,
        },
      },
    ],
    deliveryExpireDate: {
      type: Date,
    },
    quantity: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    profit: {
      type: Number,
    },
    hasDelivery: {
      type: Boolean,
      default: false,
    },
    deliveryDistance: {
      type: Number,
    },
    deliveryFee: {
      type: Number,
    },
    totalCost: {
      type: Number,
    },
    deliveryPricePerKm: {
      type: Number,
    },
    tx_ref: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        'inprogress',
        'delivered',
        'expired',
        'rejected',
        'pending',
        'refunded',
        'unpaid',
      ],
      default: 'unpaid',
      required: true,
    },
  },
  { timestamps: true }
);

export default orderSchema;
