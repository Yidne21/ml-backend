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

export async function addToCart({
  userId,
  pharmacyId,
  drugId,
  quantity,
  stockId,
  deliveryFee,
}) {
  const CartModel = this.model(modelNames.cart);
  const DrugModel = this.model(modelNames.drug);
  const StockModel = this.model(modelNames.stock);
  const PharmacyModel = this.model(modelNames.pharmacy);
  try {
    let cart = await CartModel.findOne({
      userId: mongoose.Types.ObjectId(userId),
      pharmacyId: mongoose.Types.ObjectId(pharmacyId),
    });

    const drugDb = await DrugModel.findById(drugId);
    const stock = await StockModel.findById(stockId);
    const pharmacy = await PharmacyModel.findById(pharmacyId);

    if (cart) {
      const drugIndex = cart.drugs.findIndex(
        (drug) =>
          drug.drugId.toString() === drugId &&
          drug.stockId.toString() === stockId
      );

      if (drugIndex === -1) {
        cart.drugs.push({
          drugId: mongoose.Types.ObjectId(drugId),
          stockId: mongoose.Types.ObjectId(stockId),
          quantity,
          price: stock.price,
          drugName: drugDb.name,
        });
        cart.totalQuantity += quantity;
        cart.totalPrice += stock.price * quantity;
      } else {
        cart.drugs[drugIndex].quantity += quantity;
        cart.totalQuantity += quantity;
        cart.totalPrice += cart.drugs[drugIndex].price * quantity;
      }

      await cart.save();

      return {
        success: 'Cart Updated Successfully',
      };
    }

    cart = new CartModel({
      userId: mongoose.Types.ObjectId(userId),
      pharmacyId: mongoose.Types.ObjectId(pharmacyId),
      pharmacyName: pharmacy.name,
      drugs: [
        {
          drugId: mongoose.Types.ObjectId(drugId),
          stockId: mongoose.Types.ObjectId(stockId),
          quantity,
          price: stock.price,
          drugName: drugDb.name,
        },
      ],
      totalPrice: stock.price * quantity,
      totalQuantity: quantity,
      deliveryFee,
    });
    await cart.save();
    return {
      success: 'Cart Added Successfully',
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
