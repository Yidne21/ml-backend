/* eslint-disable camelcase */

import { v4 as uuidv4 } from 'uuid';

const validPaymentDetails = {
  amount: '1000', // Example amount in cents
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '0900123456',
  currency: 'ETB',
  tx_ref: uuidv4(),
};

const missingReqTx_Ref = {
  ...validPaymentDetails,
  tx_ref: '',
};

const invalidCurrency = {
  ...validPaymentDetails,
  currency: 'AAA', // Invalid currency
};

const invalidAmount = {
  ...validPaymentDetails,
  amount: -100, // Negative amount
};

const validTransactionRef = validPaymentDetails.tx_ref;

const invalidTransactionRef = 'TX987654321';

const nonExistentTransactionRef = 'TX000000000';

const validTransferDetails = {
  account_name: 'Alice Smith',
  account_number: '1234567890',
  amount: 5000, // Example amount in cents
  beneficiary_name: 'Alice Smith',
  currency: 'NGN',
  reference: 'REF123456789',
  bank_code: '011',
};

const missingAccountName = {
  account_number: '1234567890',
  amount: 5000,
  beneficiary_name: 'Alice Smith',
  currency: 'NGN',
  reference: 'REF123456789',
  bank_code: '011',
};

const invalidBankCode = {
  account_name: 'Alice Smith',
  account_number: '1234567890',
  amount: 5000,
  beneficiary_name: 'Alice Smith',
  currency: 'NGN',
  reference: 'REF123456789',
  bank_code: '999', // Invalid bank code
};

export {
  validPaymentDetails,
  missingReqTx_Ref,
  invalidAmount,
  validTransactionRef,
  invalidTransactionRef,
  nonExistentTransactionRef,
  validTransferDetails,
  missingAccountName,
  invalidBankCode,
  invalidCurrency,
};
