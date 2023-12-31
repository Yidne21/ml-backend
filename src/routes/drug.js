import express from 'express';
import {
  filterDrugController,
  drugDetailController,
} from '../controllers/drug';

const router = express.Router();

router.get('/', filterDrugController);
router.get('/:drugId', drugDetailController);

export default router;
