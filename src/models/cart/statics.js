import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';

export async function saveCart({
  userId,
  drugs,
  totalPrice,
  totalQuantity,
  pharmacyId,
  pharmacyName,
}) {
  const CartModel = this.model(modelNames.cart);
  try {
    const cart = await CartModel.findOneAndUpdate(
      {
        userId: mongoose.Types.ObjectId(userId),
        pharmacyId: mongoose.Types.ObjectId(pharmacyId),
      },
      {
        userId: mongoose.Types.ObjectId(userId),
        pharmacyId: mongoose.Types.ObjectId(pharmacyId),
        pharmacyName,
        drugs,
        totalPrice,
        totalQuantity,
      },
      { upsert: true, new: true }
    );

    return {
      success: true,
      cart,
    };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function getCart(userId) {
  const CartModel = this.model(modelNames.cart);
  try {
    const cart = await CartModel.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });
    return cart;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function deleteCart({ userId, cartId }) {
  const CartModel = this.model(modelNames.cart);
  try {
    const cart = await CartModel.findOneAndDelete({
      userId: mongoose.Types.ObjectId(userId),
      _id: mongoose.Types.ObjectId(cartId),
    });

    return cart;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}
