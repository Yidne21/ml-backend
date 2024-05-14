import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils';

export async function filterOrders({
  customerId,
  pharmacyId,
  searchQuery,
  sortBy,
  sortOrder,
  status,
  page = 1,
  limit = 10,
}) {
  const OrderModel = this.model(modelNames.order);
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
          ...(customerId && {
            orderedBy: mongoose.Types.ObjectId(customerId),
          }),
          ...(pharmacyId && {
            orderedTo: mongoose.Types.ObjectId(pharmacyId),
          }),
          status: { $ne: 'unpaid' },
          ...(status && { status }),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'orderedBy',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $unwind: '$customer',
      },
      ...(!pharmacyId
        ? [
            {
              $lookup: {
                from: 'pharmacies',
                localField: 'orderedTo',
                foreignField: '_id',
                as: 'pharmacy',
              },
            },
            {
              $unwind: '$pharmacy',
            },
          ]
        : []),
      {
        $match: {
          ...(searchQuery && {
            'customer.name': {
              $regex: searchQuery,
              $options: 'i',
            },
          }),
          ...(searchQuery && {
            'customer.email': {
              $regex: searchQuery,
              $options: 'i',
            },
          }),
          ...(searchQuery && {
            'customer.phoneNumber': {
              $regex: searchQuery,
              $options: 'i',
            },
          }),
          ...(searchQuery && {
            'pharmacy.name': {
              $regex: searchQuery,
              $options: 'i',
            },
          }),
          ...(searchQuery && {
            'pharmacy.email': {
              $regex: searchQuery,
              $options: 'i',
            },
          }),
        },
      },
      {
        $project: {
          'customer.name': 1,
          'customer.email': 1,
          'pharmacy.name': 1,
          'pharmacy.email': 1,
          deliveryAddress: 1,
          deliveryExpireDate: 1,
          status: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1,
        },
      },
      ...paginationPipeline(page, limit),
    ]);
    return orders[0];
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

export async function getOrder(orderId) {
  const OrderModel = this.model(modelNames.order);
  try {
    const order = await OrderModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(orderId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'orderedBy',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $lookup: {
          from: 'pharmacies',
          localField: 'orderedTo',
          foreignField: '_id',
          as: 'pharmacy',
        },
      },
      {
        $unwind: '$customer',
      },
      {
        $unwind: '$pharmacy',
      },
      {
        $project: {
          'customer.name': 1,
          'customer.email': 1,
          'pharmacy.name': 1,
          'pharmacy.email': 1,
          'pharmacy.phoneNumber': 1,
          'pharmacy.location': 1,
          'pharmacy._id': 1,
          deliveryAddress: 1,
          deliveryExpireDate: 1,
          hasDelivery: 1,
          totalAmount: 1,
          drugs: 1,
          deliveryDistance: 1,
          status: 1,
          quantity: 1,
          deliveryFee: 1,
          profit: 1,
          totalCost: 1,
          deliveryPricePerKm: 1,
        },
      },
    ]);
    return order[0];
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

export async function updateOrderStatus({
  orderId,
  status,
  deliveryExpireDate,
}) {
  const OrderModel = this.model(modelNames.order);
  try {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status, ...(deliveryExpireDate ? { deliveryExpireDate } : {}) },
      { new: true }
    );
    if (!order) {
      throw new APIError('Order not found', httpStatus.NOT_FOUND, true);
    }

    return { success: true };
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

export async function createOrder({
  orderedTo,
  orderedBy,
  deliveryAddress,
  quantity,
  deliveryExpireDate,
  totalAmount,
  drugs,
  hasDelivery,
  // eslint-disable-next-line camelcase
  tx_ref,
}) {
  const data = {
    orderedTo,
    orderedBy,
    deliveryAddress,
    quantity,
    hasDelivery,
    deliveryExpireDate,
    totalAmount,
    drugs,
    tx_ref,
  };
  const OrderModel = this.model(modelNames.order);
  try {
    const order = await OrderModel.create(data);
    if (!order) {
      throw new APIError('Order not created', httpStatus.BAD_REQUEST, true);
    }
    return order;
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
