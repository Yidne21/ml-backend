import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils/index';

export async function filterTransaction({
  senderName,
  receiverName,
  accountHolderName,
  accountNumber,
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
          ...(accountHolderName && {
            $or: [
              {
                'senderAccount.accountHolderName': {
                  $regex: accountHolderName,
                  $options: 'i',
                },
              },
              {
                'receiverAccount.accountHolderName': {
                  $regex: accountHolderName,
                  $options: 'i',
                },
              },
            ],
          }),
          ...(accountNumber && {
            $or: [
              {
                'senderAccount.accountNumber': {
                  $regex: accountNumber,
                  $options: 'i',
                },
              },
              {
                'receiverAccount.accountNumber': {
                  $regex: accountNumber,
                  $options: 'i',
                },
              },
            ],
          }),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $unwind: '$sender',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiver',
        },
      },
      {
        $unwind: '$receiver',
      },
      {
        $match: {
          ...(senderName && {
            'sender.name': { $regex: senderName, $options: 'i' },
          }),
          ...(receiverName && {
            'receiver.name': { $regex: receiverName, $options: 'i' },
          }),
        },
      },
      {
        $project: {
          sender: {
            name: 1,
            email: 1,
          },
          receiver: {
            name: 1,
            email: 1,
          },
          senderAccount: 1,
          receiverAccount: 1,
          reason: 1,
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
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $unwind: '$sender',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiver',
        },
      },
      {
        $unwind: '$receiver',
      },
      {
        $project: {
          sender: {
            name: 1,
            email: 1,
          },
          receiver: {
            name: 1,
            email: 1,
          },
          senderAccount: 1,
          receiverAccount: 1,
          reason: 1,
          createdAt: 1,
        },
      },
    ]);
    if (!transaction) {
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
