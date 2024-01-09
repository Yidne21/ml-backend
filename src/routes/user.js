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
} from '../controllers/user';
import { authenticateJwt } from '../controllers/middlewares';

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

export default router;
