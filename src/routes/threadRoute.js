import express from 'express';
import {
  updateDrugsStockByExpireDate,
  updateDrugStockUsingWorkerThread,
} from '../controllers/threadStock';

import {
  updateOrderStatus,
  updateOrderStatusUsingWorkerThread,
} from '../controllers/threadOrder';

import {
  updateTransactionStatus,
  updateTransactionStatusUsingWorkerThread,
} from '../controllers/threadTransaction';

const router = express.Router();

// stock
router.put('/updateStock-withOutThread', updateDrugsStockByExpireDate);
router.put('/updateStock-withThread', updateDrugStockUsingWorkerThread);
// order
router.put('/updateOrderStatus-withOutThread', updateOrderStatus);
router.put('/updateOrderStatus-withThread', updateOrderStatusUsingWorkerThread);

// transaction
router.put('/updateTransactionStatus-withOutThread', updateTransactionStatus);
router.put(
  '/updateTransactionStatus-withThread',
  updateTransactionStatusUsingWorkerThread
);

export default router;
