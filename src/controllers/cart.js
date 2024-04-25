import httpStatus from 'http-status';
import Cart from '../models/cart';
import APIError from '../errors/APIError';
import Pharmacy from '../models/pharmacies';

export const saveCartController = async (req, res, next) => {
  const { _id, role } = req.user;
  const { drugs } = req.body;
  const { pharmacyId } = req.body;
  if (role !== 'customer') {
    throw new APIError(
      'You are not authorized to perform this action',
      httpStatus.UNAUTHORIZED,
      true
    );
  }

  const pharmacy = Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
  }
  let totalQuantity;
  let totalPrice;

  drugs.forEach((drug) => {
    totalQuantity += drug.quantity;
    totalPrice += drug.price * drug.quantity;
  });
  try {
    const cart = await Cart.saveCart({
      userId: _id,
      pharmacyId,
      pharmacyName: pharmacy.name,
      drugs,
      totalPrice,
      totalQuantity,
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCartController = async (req, res, next) => {
  const { _id, role } = req.user;
  if (role !== 'customer') {
    throw new APIError(
      'You are not authorized to perform this action',
      httpStatus.UNAUTHORIZED,
      true
    );
  }

  try {
    const cart = await Cart.getCart(_id);
    res.status(httpStatus.OK).json(cart);
  } catch (error) {
    next(error);
  }
};

export const deleteCartController = async (req, res, next) => {
  const { _id, role } = req.user;
  const { cartId } = req.params;
  if (role !== 'customer') {
    throw new APIError(
      'You are not authorized to perform this action',
      httpStatus.UNAUTHORIZED,
      true
    );
  }

  try {
    await Cart.deleteCart({
      userId: _id,
      cartId,
    });
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
