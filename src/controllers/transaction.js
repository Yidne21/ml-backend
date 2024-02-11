import httpStatus from 'http-status';
import Transaction from '../models/transactions';

export const transactionDetailController = async (req, res, next) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.transactionDetail(transactionId);
    return res.status(httpStatus.OK).json(transaction);
  } catch (error) {
    return next(error);
  }
};
export const filterTransactionController = async (req, res, next) => {
  const {
    senderName,
    receiverName,
    accountHolderName,
    accountNumber,
    reason,
    sortBy,
    sortOrder,
    createdAt,
    page,
    limit,
  } = req.query;
  const filter = { senderName, receiverName, page, limit };
  try {
    const transactions = await Transaction.filterTransaction(filter);
    return res.status(httpStatus.OK).json(transactions);
  } catch (error) {
    return next(error);
  }
};
