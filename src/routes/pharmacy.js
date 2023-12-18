import express from 'express';
import {
  filterPharmacyController,
  parmacyDetailController,
} from '../controllers/pharmacy';

const router = express.Router();

router.get('/filter', filterPharmacyController);
router.get('/:pharmacyId', parmacyDetailController);

export default router;
