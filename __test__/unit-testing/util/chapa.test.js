/* eslint-disable no-undef */
/* eslint-disable camelcase */

import chai from 'chai';
import 'mocha';

import {
  initializePayment,
  verifyPayment,
  getListOfBanks,
  verifyTransfer,
  getListOfTransfers,
  transferToBank,
} from '../../../src/utils/chapa';
import {
  validPaymentDetails,
  invalidAmount,
  validTransactionRef,
  invalidTransactionRef,
  nonExistentTransactionRef,
  validTransferDetails,
  missingAccountName,
  invalidBankCode,
  missingReqTx_Ref,
} from './chapatestCase';

const { expect } = chai;

describe('Chapa payment method functionality Test', () => {
  describe('Test initializePayment function', () => {
    it('Should return a string url that can display chapa payment', async () => {
      const response = await initializePayment(validPaymentDetails);
      expect(response.data.checkout_url).to.be.a('string');
      expect(response.status).to.equal('success');
    });

    it('Should throw an error if amount is invalid', async () => {
      try {
        await initializePayment(invalidAmount);
      } catch (error) {
        expect(error).to.equal(
          'Error: AxiosError: Request failed with status code 400'
        );
      }
    });
  });
});
