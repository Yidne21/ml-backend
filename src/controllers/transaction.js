/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Transaction from '../models/transactions';
import {
  initializePayment,
  getListOfBanks,
  transferToBank,
  getListOfTransfers,
} from '../utils/chapa';
import Order from '../models/orders';
import { webhookKey } from '../config/environments';

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
    searchQuery,
    customerId,
    pharmacyId,
    sortBy,
    sortOrder,
    page,
    limit,
  } = req.query;
  const filter = {
    searchQuery,
    customerId,
    pharmacyId,
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
  const hash = crypto
    .createHmac('sha256', webhookKey)
    .update(JSON.stringify(req.body))
    .digest('hex');
  try {
    if (hash === req.headers['x-chapa-signature']) {
      const { amount, type, reference, first_name, last_name } = req.body;
      if (type === 'Payment Link') {
        await Order.updateOne({ tz_ref: reference }, { status: 'pending' });
        const orderPaymentTransaction = {
          sender: last_name,
          senderAccount: {
            accountHolderName: first_name,
          },
          receiverAccount: {
            accountHolderName: 'MedicineLocator System',
            bankName: 'Chapa',
          },
          amount: parseFloat(amount),
          tx_ref: reference,
          reason: 'order-payment',
          status: 'completed',
        };
        await Transaction.createTransaction(orderPaymentTransaction);
      }
      await Transaction.updateOne(
        { tx_ref: reference },
        { status: 'completed' }
      );
      return res.sendStatus(200);
    }
    return res.sendStatus(401);
  } catch (error) {
    return next(error);
  }
};

export const InitiateTransactionController = async (req, res, next) => {
  const { email, _id, name, phoneNumber } = req.user;
  const { amount, cartId } = req.body;
  const tx_ref = cartId;
  const currency = 'ETB';
  const data = {
    amount,
    email,
    tx_ref,
    currency,
    first_name: name,
    last_name: _id,
    phone_number: phoneNumber || undefined,
    'customizations[title]': 'Payment for Drug Order',
    'customizations[description]':
      'Payment for Drug Order using Medicine Locator system',
  };
  try {
    const response = await initializePayment(data);
    return res.status(httpStatus.OK).json(response.data);
  } catch (error) {
    return next(error);
  }
};

export const getBanksController = async (req, res, next) => {
  try {
    const banks = await getListOfBanks();
    res.status(httpStatus.OK).json(banks);
  } catch (error) {
    next(error);
  }
};

export const transferToBankController = async (req, res, next) => {
  const tx_ref = uuidv4();
  const {
    account_number,
    account_name,
    bank_code,
    amount,
    currency,
    beneficiary_name,
  } = req.body;
  const data = {
    account_number,
    account_name,
    bank_code,
    amount,
    currency,
    beneficiary_name,
    reference: tx_ref,
  };
  try {
    const response = await transferToBank(data);
    return res.status(httpStatus.OK).json(response);
  } catch (error) {
    return next(error);
  }
};

export const getListOfTransfersController = async (req, res, next) => {
  try {
    const transfers = await getListOfTransfers();
    res.status(httpStatus.OK).json(transfers);
  } catch (error) {
    next(error);
  }
};
