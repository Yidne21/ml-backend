import express from 'express';
import {
  sendOTPValidator,
  verifyOTPValidator,
  resetPasswordValidator,
  signUpUserValidator,
  userDetailValidator,
  deleteUserValidator,
  updateUserValidator,
  loginValidator,
  refreshTokenValidator,
  registerPharmacistValidator,
  registerAdminValidator,
  setPasswordValidator,
  getAllUserValidator,
} from '../validators/user.validator';
import parseValidationResult from '../validators/errors.parser';
import {
  signUpUserController,
  userDetailController,
  deleteUserByIdController,
  getAllUserController,
  updateUserController,
  loginUserController,
  refreshTokenController,
  resetPasswordController,
  sendOTP,
  verifyOTP,
  registerPharmacistController,
  registerAdminController,
  setPassWordController,
} from '../controllers/user';
import { authenticateJwt } from '../middlewares';
import multerUploads from '../middlewares/multer';

const router = express.Router();

router.post('/send-otp', sendOTPValidator(), parseValidationResult, sendOTP);
router.post(
  '/verify-otp',
  verifyOTPValidator(),
  parseValidationResult,
  verifyOTP
);

router.post(
  '/signUp',
  signUpUserValidator(),
  parseValidationResult,
  signUpUserController
);

router.get(
  '/',
  getAllUserValidator(),
  parseValidationResult,
  getAllUserController
);

router.put(
  '/:userId',
  updateUserValidator(),
  parseValidationResult,
  updateUserController
);

router.get(
  '/:userId',
  authenticateJwt,
  userDetailValidator(),
  parseValidationResult,
  userDetailController
);

router.delete(
  '/:userId',
  deleteUserValidator(),
  parseValidationResult,
  deleteUserByIdController
);

router.post(
  '/reset-password',
  resetPasswordValidator(),
  parseValidationResult,
  resetPasswordController
);

router.post(
  '/login',
  loginValidator(),
  parseValidationResult,
  loginUserController
);

router.post(
  '/refresh-token',
  refreshTokenValidator(),
  parseValidationResult,
  refreshTokenController
);

router.post(
  '/pharmacist',
  registerPharmacistValidator(),
  parseValidationResult,
  multerUploads.single('file'),
  registerPharmacistController
);

router.post(
  '/admin',
  registerAdminValidator(),
  parseValidationResult,
  registerAdminController
);

router.put(
  '/admin/set-password',
  setPasswordValidator(),
  parseValidationResult,
  setPassWordController
);

export default router;
