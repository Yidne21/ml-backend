import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils';

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
    console.log(error);
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

export async function getCarts({ userId, page = 1, limit = 5 }) {
  const CartModel = this.model(modelNames.cart);
  try {
    const cart = await CartModel.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
      ...paginationPipeline(page, limit),
    ]);
    return cart[0];
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

    if (!cart) {
      throw new APIError('cart not found', httpStatus.NOT_FOUND, true);
    }

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
