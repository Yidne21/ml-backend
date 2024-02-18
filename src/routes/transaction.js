import express from 'express';
import {
  transactionDetailController,
  filterTransactionController,
  chapaTransactionController,
  InitiateTransactionController,
} from '../controllers/transaction';

const router = express.Router();

router.get('/:transactionId', transactionDetailController);
router.get('/', filterTransactionController);
router.post('/chapa', chapaTransactionController);
router.post('/chapa/initiatePayment', InitiateTransactionController);

export default router;
