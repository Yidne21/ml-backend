import express from 'express';
import {
  filterDrugController,
  drugDetailController,
  createDrugController,
  updateDrugController,
  deleteDrugController,
} from '../controllers/drug';

const router = express.Router();

router.get('/', filterDrugController);
router.get('/:drugId', drugDetailController);
router.post('/', createDrugController);
router.put('/:drugId', updateDrugController);
router.delete('/:drugId', deleteDrugController);

export default router;
