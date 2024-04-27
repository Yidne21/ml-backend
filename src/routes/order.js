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
router.put(
  '/:orderId/confirm-delivery',
  authenticateJwt,
  confirmOrderDeliveryController
);
router.put('/:orderId/refund', authenticateJwt, refundController);
router.put('/:orderId/reject', authenticateJwt, rejectOrderController);
router.put('/:orderId/accept', authenticateJwt, acceptOrderController);
router.put('/:orderId/extend', authenticateJwt, extendOrderController);

export default router;
