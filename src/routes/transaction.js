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
import { authenticateJwt } from '../middlewares/index';

const router = express.Router();

router.get('/:transactionId', authenticateJwt, transactionDetailController);
router.get('/', authenticateJwt, filterTransactionController);
router.post('/chapa', authenticateJwt, chapaTransactionController);
router.post(
  '/chapa/initiatePayment',
  authenticateJwt,
  InitiateTransactionController
);
router.get('/chapa/banks', getBanksController);
router.post('/chapa/transfer', authenticateJwt, transferToBankController);
router.get('/chapa/transfers', authenticateJwt, getListOfTransfersController);

export default router;
