import express from 'express';
import {
  registerUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
} from '../validators/user.validator';
import parseValidationResult from '../validators/errors.parser';
import {
  registerUserController,
  getSingleUserByIdController,
  deleteUserByIdController,
  getAllUserController,
  updateUserController,
  loginUserController,
  refreshTokenController,
} from '../controllers/user';
import { authenticateJwt } from '../controllers/middlewares';

const router = express.Router();

router.post(
  '/create',
  // authenticateJwt,
  registerUserValidator(),
  parseValidationResult,
  registerUserController
);

router.get('/all', getAllUserController);

router.put(
  '/:userId',
  updateUserValidator(),
  parseValidationResult,
  updateUserController
);

router.get(
  '/:userId',
  getUserValidator(),
  parseValidationResult,
  getSingleUserByIdController
);

router.delete(
  '/:userId',
  deleteUserValidator(),
  parseValidationResult,
  deleteUserByIdController
);

router.post('/login', parseValidationResult, loginUserController);

router.post('/refresh-token', parseValidationResult, refreshTokenController);

export default router;
