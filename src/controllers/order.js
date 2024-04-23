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
