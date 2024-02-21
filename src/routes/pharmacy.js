import express from 'express';
import {
  filterPharmacyController,
  parmacyDetailController,
  getMyPharmacyController,
} from '../controllers/pharmacy';
import parseValidationResult from '../validators/errors.parser';

import { authenticateJwt } from '../middlewares/middlewares';

const router = express.Router();

router.get('/', filterPharmacyController);
router.get('/:pharmacyId', parmacyDetailController);
router.get('/pharmacist/my-pharmacy', authenticateJwt, getMyPharmacyController);

export default router;
