import express from 'express';
import {
  transactionDetailController,
  filterTransactionController,
  chapaTransactionController,
  InitiateTransactionController,
  getBanksController,
  transferToBankController,
  getListOfTransfersController,
} from '../controllers/transaction';

const router = express.Router();

router.get('/:transactionId', transactionDetailController);
router.get('/', filterTransactionController);
router.post('/chapa', chapaTransactionController);
router.post('/chapa/initiatePayment', InitiateTransactionController);
router.get('/chapa/banks', getBanksController);
router.post('/chapa/transfer', transferToBankController);
router.get('/chapa/transfers', getListOfTransfersController);

export default router;
