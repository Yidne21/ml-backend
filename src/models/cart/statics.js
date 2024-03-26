import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils';

export async function filterCart({ userId, page = 1, limit = 10 }) {
  const CartModel = this.model(modelNames.cart);
  const pipeline = [
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
      },
    },
    ...paginationPipeline(page, limit),
  ];

  try {
    const cart = CartModel.aggregate(pipeline);
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

export async function getCartByUserId(userId) {
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

export async function updateCart({ userId, drugId, quantity }) {
  const CartModel = this.model(modelNames.cart);
  try {
    const drug = await CartModel.findOneAndUpdate(
      {
        userId: mongoose.Types.ObjectId(userId),
        'drug.drugId': mongoose.Types.ObjectId(drugId),
      },
      {
        $inc: { 'drug.$.quantity': quantity },
      },
      { new: true }
    );

    return drug;
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

export async function deleteCart(userId) {
  const CartModel = this.model(modelNames.cart);
  try {
    const cart = await CartModel.findOneAndDelete({
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

export async function createCart(cart) {
  const CartModel = this.model(modelNames.cart);
  try {
    const newcart = await CartModel.create(cart);

    return newcart;
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
