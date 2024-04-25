import express from 'express';
import {
  createOrderController,
  orderDetailController,
  filterOrderController,
  confirmOrderDeliveryController,
  refundController,
  rejectOrderController,
  acceptOrderController,
  extendOrderController,
} from '../controllers/order';

import { authenticateJwt } from '../middlewares';

const router = express.Router();

router.post('/:cartId', authenticateJwt, createOrderController);
router.get('/:orderId', orderDetailController);
router.get('/', filterOrderController);
router.put('/:orderId/confirm-delivery', confirmOrderDeliveryController);
router.put('/:orderId/refund', refundController);
router.put('/:orderId/reject', rejectOrderController);
router.put('/:orderId/accept', acceptOrderController);
router.put('/:orderId/extend', extendOrderController);

export default router;
