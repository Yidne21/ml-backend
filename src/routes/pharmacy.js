import express from 'express';
import {
  filterPharmacyController,
  parmacyDetailController,
  getMyPharmacyController,
  addPharmacyController,
  updatePharmacyController,
  getPharmacyAddressController,
  updatePharmacyStatusController,
  assignToAdminController,
} from '../controllers/pharmacy';
import parseValidationResult from '../validators/errors.parser';

import { authenticateJwt } from '../middlewares';

const router = express.Router();

router.get('/', authenticateJwt, filterPharmacyController);
router.get('/:pharmacyId', parmacyDetailController);
router.get('/pharmacist/my-pharmacy', authenticateJwt, getMyPharmacyController);
router.post('/pharmacist', authenticateJwt, addPharmacyController);
router.put('/:pharmacyId', authenticateJwt, updatePharmacyController);
router.put(
  '/admin/:pharmacyId',
  authenticateJwt,
  updatePharmacyStatusController
);
router.get('/mobile/address', getPharmacyAddressController);
router.put('/assign/:adminId', authenticateJwt, assignToAdminController);

export default router;
