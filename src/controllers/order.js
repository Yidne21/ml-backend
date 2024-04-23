import httpStatus from 'http-status';
import Order from '../models/orders';
import Transaction from '../models/transactions';
import Notification from '../models/notifications';
import Pharmacy from '../models/pharmacies';
import Stock from '../models/stocks';
import Drug from '../models/drugs';
import { transferToBank } from '../utils/chapa';
import APIError from '../errors/APIError';

export const createOrderController = async (req, res, next) => {
  const { orderTo, orderedBy, deliveryAddress, deliveryExpireDate, quantity } =
    req.body;

  const { drugId } = req.params;
  const data = {
    orderTo,
    orderedBy,
    deliveryAddress,
    drugId,
    deliveryExpireDate,
    quantity,
  };
  try {
    const order = await Order.createOrder(data);
    res.status(httpStatus.CREATED).json(order);
  } catch (error) {
    next(error);
  }
}; // after a successful payment
export const orderDetailController = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await Order.getOrder(orderId);
    res.status(httpStatus.OK).json(order);
  } catch (error) {
    next(error);
  }
};
export const filterOrderController = async (req, res, next) => {
  const {
    customerId,
    pharmacyId,
    searchQuery,
    sortBy,
    sortOrder,
    status,
    page,
    limit,
  } = req.query;

  const filter = {
    customerId,
    pharmacyId,
    searchQuery,
    sortBy,
    sortOrder,
    status,
    page,
    limit,
  };
  try {
    const orders = await Order.filterOrders(filter);
    res.status(httpStatus.OK).json(orders);
  } catch (error) {
    next(error);
  }
};
export const confirmOrderDeliveryController = async (req, res, next) => {
  const { orderId } = req.params;
  const { role, _id } = req.user;
  try {
    if (role !== 'customer') {
      throw new APIError(
        'You are not authorized to perform this action',
        httpStatus.UNAUTHORIZED,
        true
      );
    }
    const order = await Order.findOne({ _id: orderId, orderedBy: _id });
    if (!order) {
      throw new APIError('Order not found', httpStatus.NOT_FOUND, true);
    }

    if (order.status !== 'inprogress') {
      throw new APIError(
        'Order is  not in progress, ',
        httpStatus.BAD_REQUEST,
        true
      );
    }

    const pharmacy = await Pharmacy.findOne({ _id: order.orderedTo });
    if (!pharmacy) {
      throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
    }

    const message = await Order.updateOrder(orderId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const refundController = async (req, res, next) => {
  const { orderId } = req.params;
  const { bank, accountName, accountNumber } = req.body;
  const bankDetails = {
    bank,
    accountName,
    accountNumber,
  };
  try {
    const message = await Order.updateOrder(orderId, bankDetails);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const rejectOrderController = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const message = await Order.updateOrder(orderId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const acceptOrderController = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const message = await Order.updateOrder(orderId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const extendOrderController = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const message = await Order.updateOrder(orderId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};
