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
      {
        $lookup: {
          from: 'drugs',
          localField: 'drugId',
          foreignField: '_id',
          as: 'drug',
        },
      },
      {
        $unwind: '$drug',
      },
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
          'drug.name': 1,
          'drug.price': 1,
          'drug.cost': 1,
          deliveryAddress: 1,
          drugId: 1,
          orderedBy: 1,
          orderedTo: 1,
          deliveryDate: 1,
          status: 1,
          createdAt: 1,
          quantity: 1,
          profit: {
            $subtract: [
              {
                $multiply: ['$drug.price', '$quantity'],
              },
              {
                $multiply: ['$drug.cost', '$quantity'],
              },
            ],
          },
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
        $lookup: {
          from: 'drugs',
          localField: 'drugId',
          foreignField: '_id',
          as: 'drug',
        },
      },
      {
        $lookup: {
          from: 'transactions',
          localField: 'transactionId',
          foreignField: '_id',
          as: 'transaction',
        },
      },
      {
        $unwind: '$transaction',
      },
      {
        $unwind: '$drug',
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
          'drug.name': 1,
          'drug.price': 1,
          'drug.cost': 1,
          'drug.expiredDate': 1,
          'transaction.amount': 1,
          'transaction.reason': 1,
          'transaction.senderAccount': 1,
          'transaction.receiverAccount': 1,
          deliveryAddress: 1,
          drugId: 1,
          deliveryDate: 1,
          status: 1,
          quantity: 1,
          orderedAt: 1,
          abortedAt: 1,
          deliveredAt: 1,
          transactionId: 1,
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

export async function updateOrderStatus({ orderId, status }) {
  const OrderModel = this.model(modelNames.order);
  try {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
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
  orderTo,
  orderedBy,
  deliveryAddress,
  drugId,
  deliveryExpireDate,
  quantity,
}) {
  const data = {
    orderTo,
    orderedBy,
    deliveryAddress,
    drugId,
    deliveryExpireDate,
    quantity,
  };

  const OrderModel = this.model(modelNames.order);
  try {
    const order = await OrderModel.create(data);
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
