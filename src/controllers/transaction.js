/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import Transaction from '../models/transactions';
import { initializePayment } from '../utils/chapa';

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
    sortBy,
    sortOrder,
    page,
    limit,
  } = req.query;
  const filter = {
    senderName,
    receiverName,
    accountHolderName,
    accountNumber,
    sortBy,
    sortOrder,
    page,
    limit,
  };
  try {
    const transactions = await Transaction.filterTransaction(filter);
    return res.status(httpStatus.OK).json(transactions);
  } catch (error) {
    return next(error);
  }
};

export const chapaTransactionController = async (req, res, next) => {
  const {
    account_name,
    account_number,
    bank_id,
    bank_name,
    currency,
    amount,
    type,
    status,
    reference,
    chapa_reference,
    created_at,
    first_name,
    last_name,
    email,
    charge,
    mode,
    updated_at,
  } = req.body;
  const transaction = {
    account_name,
    account_number,
    bank_id,
    bank_name,
    currency,
    amount,
    type,
    status,
    reference,
    chapa_reference,
    created_at,
    first_name,
    last_name,
    email,
    charge,
    mode,
    updated_at,
  };
  try {
    console.log(transaction);
    // const message = await Transaction.chapaTransaction(transaction);
    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
};

export const InitiateTransactionController = async (req, res, next) => {
  const { amount, phone_number } = req.body;
  const tx_ref = uuidv4();
  const currency = 'ETB';
  const data = {
    amount,
    phone_number,
    tx_ref,
    currency,
  };
  try {
    const response = await initializePayment(data);
    return res.status(httpStatus.OK).json(response.data);
  } catch (error) {
    return next(error);
  }
};
