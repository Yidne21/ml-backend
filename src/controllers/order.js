import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import Order from '../models/orders';
import Transaction from '../models/transactions';
import Notification from '../models/notifications';
import Pharmacy from '../models/pharmacies';
import Drug from '../models/drugs';
import { transferToBank } from '../utils/chapa';
import APIError from '../errors/APIError';
import { addMinutes, calculateDistance } from '../utils';
import Stock from '../models/stocks';

export const createOrderController = async (req, res, next) => {
  const { role, _id } = req.user;
  if (role !== 'customer') {
    throw new APIError(
      'You are not authorized to perform this action',
      httpStatus.UNAUTHORIZED,
      true
    );
  }
  const { orderTo, deliveryAddress, quantity, stockId } = req.body;

  const { drugId } = req.params;
  try {
    const drug = await Drug.findOne({ _id: drugId });
    if (!drug) {
      throw new APIError('Drug not found', httpStatus.NOT_FOUND, true);
    }

    const stock = await Stock.findOne({ _id: stockId });
    if (!stock) {
      throw new APIError('Stock not found', httpStatus.NOT_FOUND, true);
    }

    const pharmacy = await Pharmacy.findOne({ _id: orderTo });
    if (!pharmacy) {
      throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
    }

    const distance = calculateDistance({
      lat1: pharmacy.location.coordinates[1],
      long1: pharmacy.location.coordinates[0],
      lat2: deliveryAddress.location.coordinates[1],
      long2: deliveryAddress.location.coordinates[0],
    });

    if (distance > pharmacy.deliveryCoverage) {
      throw new APIError(
        'Delivery address is out of the pharmacy delivery coverage, please choose another pharmacy',
        httpStatus.BAD_REQUEST,
        true
      );
    }

    const deliveryExpireDate = addMinutes(new Date(), pharmacy.maxDeliveryTime);
    const totalAmount =
      stock.price * quantity + pharmacy.deliveryPricePerKm * distance;

    const data = {
      orderTo,
      orderedBy: _id,
      deliveryAddress,
      drugId,
      quantity,
      stockId,
      deliveryExpireDate,
      totalAmount,
    };
    const success = await Order.createOrder(data);
    if (!success) {
      throw new APIError(
        'Failed to create order, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    await Notification.createNotification({
      userId: pharmacy.pharmacistId,
      title: 'New Order',
      message: `You have a new order from ${req.user.name}, please check your ${pharmacy.name} pharmacy dashboard`,
    });
    res.status(httpStatus.CREATED).json(success);
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

    const session = mongoose.startSession();
    session.startTransaction();

    const sale = await Drug.saleDrug({
      drugId: order.drugId,
      quantity: order.quantity,
      amount: order.totalAmount,
      stockId: order.stockId,
      pharmacyId: pharmacy._id,
      userId: pharmacy.pharmacistId,
    });

    if (!sale) {
      await session.abortTransaction();
      throw new APIError(
        'Failed to update stock, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    const reference = uuidv4();
    const response = await transferToBank({
      account_name: pharmacy.account.accountHolderName,
      account_number: pharmacy.account.accountNumber,
      amount: order.totalAmount,
      beneficiary_name: pharmacy.name,
      currency: 'ETB',
      reference,
      bank_code: pharmacy.bankCode,
    });

    if (response.status === 'failed') {
      await session.abortTransaction();
      throw new APIError(
        'please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    const transactionData = {
      receiver: pharmacy._id,
      orderId,
      senderAccount: {
        accountHolderName: 'Medicine Locator system',
        accountType: 'chapa',
      },
      receiverAccount: pharmacy.account,
      amount: order.totalAmount,
      tx_ref: reference,
      reason: 'pharmacy-payment',
    };

    const transaction = await Transaction.createTransaction(transactionData);
    if (!transaction) {
      await session.abortTransaction();
      throw new APIError(
        'Failed to create transaction, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    const message = await Order.updateOrderStatus({
      orderId,
      status: 'delivered',
    });

    if (!message) {
      await session.abortTransaction();
      throw new APIError(
        'Failed to update order status, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    await Notification.createNotification({
      userId: pharmacy.pharmacistId,
      title: 'Order Delivered',
      message: `Order with id ${orderId} has been delivered, please check your account for payment with reference ${reference}`,
    });

    await session.commitTransaction();
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const refundController = async (req, res, next) => {
  const { _id, role, name } = req.user;
  if (role !== 'customer') {
    throw new APIError(
      'You are not authorized to perform this action',
      httpStatus.UNAUTHORIZED,
      true
    );
  }
  const { orderId } = req.params;
  const { bankName, accountName, accountNumber, bankCode, accountType } =
    req.body;
  const bankDetails = {
    accountHolderName: accountName,
    accountNumber,
    bankName,
    accountType,
  };
  try {
    const order = await Order.findOne({ _id: orderId, orderedBy: _id });
    if (!order) {
      throw new APIError('Order not found', httpStatus.NOT_FOUND, true);
    }

    if (order.status !== 'rejected' || order.status !== 'expired') {
      throw new APIError(
        'cannot refund order that is not rejected or expired',
        httpStatus.BAD_REQUEST,
        true
      );
    }

    const pharmacy = await Pharmacy.findOne({ _id: order.orderedTo });
    if (!pharmacy) {
      throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
    }

    const session = mongoose.startSession();
    session.startTransaction();
    const reference = uuidv4();

    const response = await transferToBank({
      account_name: accountName,
      account_number: accountNumber,
      amount: order.totalAmount,
      beneficiary_name: name,
      currency: 'ETB',
      reference,
      bank_code: bankCode,
    });

    if (response.status === 'failed') {
      await session.abortTransaction();
      throw new APIError(
        'please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    const transactionData = {
      receiver: _id,
      orderId,
      senderAccount: {
        accountHolderName: 'Medicine Locator system',
        accountType: 'chapa',
      },
      receiverAccount: bankDetails,
      amount: order.totalAmount,
      tx_ref: reference,
      reason: 'refund',
    };

    const transaction = await Transaction.createTransaction(transactionData);
    if (!transaction) {
      await session.abortTransaction();
      throw new APIError(
        'Failed to create transaction, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    const message = await Order.updateOrder({ orderId, status: 'refunded' });

    if (!message) {
      await session.abortTransaction();
      throw new APIError(
        'Failed to update order status, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    await Notification.createNotification({
      userId: order.orderedBy,
      title: 'Order Refunded',
      message: `Order with id ${orderId} has been refunded, please check your account for payment with reference ${reference}`,
    });

    await Notification.createNotification({
      userId: pharmacy.pharmacistId,
      title: 'Order Refunded',
      message: `Order with id ${orderId} has been refunded`,
    });

    await session.commitTransaction();

    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const rejectOrderController = async (req, res, next) => {
  const { _id, role } = req.user;
  if (role !== 'pharmacist') {
    throw new APIError(
      'You are not authorized to perform this action',
      httpStatus.UNAUTHORIZED,
      true
    );
  }
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, orderedTo: _id });
    if (!order) {
      throw new APIError('Order not found', httpStatus.NOT_FOUND, true);
    }

    if (order.status !== 'pending') {
      throw new APIError(
        'cannot reject order that is not in pending state',
        httpStatus.UNAUTHORIZED,
        true
      );
    }

    const pharmacy = await Pharmacy.findOne({ _id: order.orderedTo });
    if (!pharmacy) {
      throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
    }

    const session = mongoose.startSession();
    session.startTransaction();

    const message = await Order.updateOrder({ orderId, status: 'rejected' });

    if (!message) {
      await session.abortTransaction();
      throw new APIError(
        'Failed to update order status, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    await Notification.createNotification({
      userId: order.orderedBy,
      title: 'Order Rejected',
      message: `Order with id ${orderId} has been rejected by ${pharmacy.name}, You can now request for refund in your order list`,
    });

    await session.commitTransaction();

    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const acceptOrderController = async (req, res, next) => {
  const { _id, role } = req.user;
  if (role !== 'pharmacist') {
    throw new APIError(
      'You are not authorized to perform this action',
      httpStatus.UNAUTHORIZED,
      true
    );
  }
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, orderedTo: _id });
    if (!order) {
      throw new APIError('Order not found', httpStatus.NOT_FOUND, true);
    }

    if (order.status !== 'pending') {
      throw new APIError(
        'cannot accept order that is not in pending state',
        httpStatus.UNAUTHORIZED,
        true
      );
    }

    const pharmacy = await Pharmacy.findOne({ _id: order.orderedTo });
    if (!pharmacy) {
      throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
    }

    const session = mongoose.startSession();
    session.startTransaction();
    const message = await Order.updateOrder({ orderId, status: 'inprogress' });

    if (!message) {
      await session.abortTransaction();
      throw new APIError(
        'Failed to update order status, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    await Notification.createNotification({
      userId: order.orderedBy,
      title: 'Order Accepted',
      message: `Order with id ${orderId} has been accepted by the ${pharmacy.name} pharmacy, please wait for delivery`,
    });

    await session.commitTransaction();
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const extendOrderController = async (req, res, next) => {
  const { _id, role } = req.user;
  const { orderId } = req.params;
  if (role !== 'customer') {
    throw new APIError(
      'You are not authorized to perform this action',
      httpStatus.UNAUTHORIZED,
      true
    );
  }

  try {
    const order = await Order.findOne({ _id: orderId, orderedBy: _id });
    if (!order) {
      throw new APIError('Order not found', httpStatus.NOT_FOUND, true);
    }

    if (order.status !== 'expired') {
      throw new APIError(
        'cannot extend order that is not expired',
        httpStatus.UNAUTHORIZED,
        true
      );
    }

    const pharmacy = await Pharmacy.findOne({ _id: order.orderedTo });
    if (!pharmacy) {
      throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
    }

    const session = mongoose.startSession();
    session.startTransaction();

    const deliveryExpireDate = addMinutes(new Date(), pharmacy.maxDeliveryTime);
    const message = await Order.updateOrder({
      orderId,
      status: 'pending',
      deliveryExpireDate,
    });

    if (!message) {
      await session.abortTransaction();
      throw new APIError(
        'Failed extend expire date, please try again later',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    await Notification.createNotification({
      userId: pharmacy.pharmacistId,
      title: 'Order delivery date Extended',
      message: `Order with id ${orderId} has been extended, please hurry up with delivery`,
    });
    session.commitTransaction();
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};
