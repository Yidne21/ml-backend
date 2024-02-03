import express from 'express';
import {
  transactionDetailController,
  filterTransactionController,
} from '../controllers/transaction';

const router = express.Router();

router.get('/:id', transactionDetailController);
router.get('/', filterTransactionController);

export default router;
