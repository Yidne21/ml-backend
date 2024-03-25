import express from 'express';
import {
  updateDrugsStockByExpireDate,
  updateDrugStockUsingWorkerThread,
} from '../controllers/threadExa';

const router = express.Router();

router.get('/updateStock-withOutThread', updateDrugsStockByExpireDate);
router.get('/updateStock-withThread', updateDrugStockUsingWorkerThread);

export default router;
