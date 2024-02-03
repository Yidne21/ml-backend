import express from 'express';
import {
  createOrderController,
  orderDetailController,
  filterOrderController,
  confirmOrderDeliveryController,
  cancelOrderController,
} from '../controllers/order';

const router = express.Router();

router.post('/', createOrderController);
router.get('/:id', orderDetailController);
router.get('/', filterOrderController);
router.put('/:id/confirm-delivery', confirmOrderDeliveryController);
router.put('/:id/cancel', cancelOrderController);

export default router;
