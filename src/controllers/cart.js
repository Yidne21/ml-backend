import httpStatus from 'http-status';
import Cart from '../models/cart';
import APIError from '../errors/APIError';
import Pharmacy from '../models/pharmacies';

export const saveCartController = async (req, res, next) => {
  const { _id, role } = req.user;
  const { carts } = req.body;

  try {
    if (role !== 'customer') {
      throw new APIError(
        'You are not authorized to perform this action',
        httpStatus.UNAUTHORIZED,
        true
      );
    }
    carts.forEach(async (cart) => {
      await Pharmacy.findById(cart.pharmacyId);

      await Cart.saveCart({
        userId: _id,
        pharmacyId: cart.pharmacyId,
        pharmacyName: cart.pharmacyName,
        drugs: cart.drugs,
        totalPrice: cart.totalPrice,
        totalQuantity: cart.totalQuantity,
      });
    });

    res.status(httpStatus.CREATED).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getCartsController = async (req, res, next) => {
  const { _id, role } = req.user;
  const { limit, page } = req.query;

  try {
    if (role !== 'customer') {
      throw new APIError(
        'You are not authorized to perform this action',
        httpStatus.UNAUTHORIZED,
        true
      );
    }
    const cart = await Cart.getCarts({
      userId: _id,
      limit,
      page,
    });
    res.status(httpStatus.OK).json(cart);
  } catch (error) {
    next(error);
  }
};

export const deleteCartController = async (req, res, next) => {
  const { _id, role } = req.user;
  const { cartId } = req.params;

  try {
    if (role !== 'customer') {
      throw new APIError(
        'You are not authorized to perform this action',
        httpStatus.UNAUTHORIZED,
        true
      );
    }
    const message = await Cart.deleteCart({
      userId: _id,
      cartId,
    });
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};
