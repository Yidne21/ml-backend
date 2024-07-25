import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils/index';

export async function filterTransaction({
  searchQuery,
  customerId,
  pharmacyId,
  sortBy,
  sortOrder,
  page = 1,
  limit = 10,
}) {
  const TransactionModel = this.model(modelNames.transaction);

  try {
    const transactions = await TransactionModel.aggregate([
      {
        $match: {
          ...(customerId && {
            $or: [
              { sender: mongoose.Types.ObjectId(customerId) },
              { receiver: mongoose.Types.ObjectId(customerId) },
            ],
          }),
          ...(pharmacyId && {
            receiverPharmacy: mongoose.Types.ObjectId(pharmacyId),
          }),
          ...(searchQuery && {
            $or: [
              {
                'senderAccount.accountHolderName': {
                  $regex: searchQuery,
                  $options: 'i',
                },
              },
              {
                'receiverAccount.accountHolderName': {
                  $regex: searchQuery,
                  $options: 'i',
                },
              },
            ],
          }),
          ...(searchQuery && {
            $or: [
              {
                'senderAccount.accountNumber': {
                  $regex: searchQuery,
                  $options: 'i',
                },
              },
              {
                'receiverAccount.accountNumber': {
                  $regex: searchQuery,
                  $options: 'i',
                },
              },
            ],
          }),
        },
      },
      {
        $project: {
          sender: 1,
          receiver: 1,
          receiverPharmacy: 1,
          senderAccount: 1,
          receiverAccount: 1,
          amount: 1,
          tx_ref: 1,
          reason: 1,
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
    return transactions[0];
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

export async function transactionDetail(transactionId) {
  const TransactionModel = this.model(modelNames.transaction);
  try {
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      throw new APIError('Invalid transactionId', httpStatus.BAD_REQUEST, true);
    }

    const transaction = await TransactionModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(transactionId),
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: '_id',
          as: 'order',
        },
      },
      {
        $unwind: {
          path: '$order',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          sender: 1,
          order: {
            orderedBy: 1,
            totalAmount: 1,
            quantity: 1,
            status: 1,
          },
          amount: 1,
          tx_ref: 1,
          status: 1,
          receiver: 1,
          senderAccount: 1,
          receiverPharmacy: 1,
          receiverAccount: 1,
          reason: 1,
          createdAt: 1,
        },
      },
    ]);
    if (!transaction[0]) {
      throw new APIError('Transaction not found', httpStatus.NOT_FOUND, true);
    }
    return transaction[0];
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

export async function createTransaction(transaction) {
  const TransactionModel = this.model(modelNames.transaction);

  const transactionData = {
    sender: transaction.sender,
    receiver: transaction.receiver,
    senderAccount: transaction.senderAccount,
    receiverAccount: transaction.receiverAccount,
    amount: transaction.amount,
    tx_ref: transaction.tx_ref,
    reason: transaction.reason,
    status: transaction.status,
  };

  try {
    const createdTransaction = await TransactionModel.create(transactionData);
    return createdTransaction._id;
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
