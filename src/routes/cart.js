import express from 'express';
import {
  saveCartController,
  getCartsController,
  deleteCartController,
  addToCartController,
} from '../controllers/cart';

import { authenticateJwt } from '../middlewares';

const router = express.Router();

router.post('/', authenticateJwt, saveCartController);
router.get('/', authenticateJwt, getCartsController);
router.delete('/:cartId', authenticateJwt, deleteCartController);
router.post('/add', authenticateJwt, addToCartController);

export default router;
