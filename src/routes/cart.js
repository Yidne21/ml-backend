import express from 'express';
import {
  saveCartController,
  getCartController,
  deleteCartController,
} from '../controllers/cart';

import { authenticateJwt } from '../middlewares';

const router = express.Router();

router.post('/', authenticateJwt, saveCartController);
router.get('/:cartId', authenticateJwt, getCartController);
router.delete('/:cartId', authenticateJwt, deleteCartController);

export default router;
