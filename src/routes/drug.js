import express from 'express';
import {
  filterDrugController,
  drugDetailController,
  createDrugController,
  updateDrugController,
  deleteDrugController,
} from '../controllers/drug';

import {
  addStockController,
  getStocksController,
  updateStockController,
  deleteStockController,
} from '../controllers/stock';

const router = express.Router();

router.get('/', filterDrugController);
router.get('/:drugId', drugDetailController);
router.post('/:pharmacyId', createDrugController);
router.put('/:drugId', updateDrugController);
router.delete('/:drugId', deleteDrugController);
router.post('/stocks/:drugId', addStockController);
router.get('/stocks/:drugId', getStocksController);
router.put('/stocks/:stockId', updateStockController);
router.delete('/stocks/:stockId', deleteStockController);

export default router;
