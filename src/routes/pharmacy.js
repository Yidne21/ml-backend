import express from 'express';
import {
  filterPharmacyController,
  parmacyDetailController,
  getMyPharmacyController,
  addPharmacyController,
} from '../controllers/pharmacy';
import parseValidationResult from '../validators/errors.parser';

import { authenticateJwt } from '../middlewares';

const router = express.Router();

router.get('/', filterPharmacyController);
router.get('/:pharmacyId', parmacyDetailController);
router.get('/pharmacist/my-pharmacy', authenticateJwt, getMyPharmacyController);
router.post('/pharmacist', authenticateJwt, addPharmacyController);

export default router;
