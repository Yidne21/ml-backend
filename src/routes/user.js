import express from 'express';
import {
  registerUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
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
  activateAccountController,
  forgotPasswordController,
  resetPasswordWithEmailController,
} from '../controllers/user';
import { authenticateJwt } from '../middlewares/middlewares';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

router.post(
  '/create',
  // authenticateJwt,
  //  registerUserValidator(),
  parseValidationResult,
  signUpUserController
);

router.get('/all', getAllUserController);

router.put(
  '/:userId',
  // updateUserValidator(),
  parseValidationResult,
  updateUserController
);

router.get(
  '/:userId',
  // getUserValidator(),
  parseValidationResult,
  userDetailController
);

router.delete(
  '/:userId',
  // deleteUserValidator(),
  parseValidationResult,
  deleteUserByIdController
);

router.post('/reset-password', parseValidationResult, resetPasswordController);

router.post('/login', parseValidationResult, loginUserController);

router.post('/refresh-token', parseValidationResult, refreshTokenController);

router.post('/pharmacist', parseValidationResult, registerPharmacistController);
router.post(
  '/activate-account',
  parseValidationResult,
  activateAccountController
);

router.post(
  '/forgot-password',
  parseValidationResult,
  forgotPasswordController
);

router.post(
  '/reset-passwordWithEmail',
  parseValidationResult,
  resetPasswordWithEmailController
);

export default router;
