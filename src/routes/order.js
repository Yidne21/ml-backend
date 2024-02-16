import express from 'express';
import {
  createOrderController,
  orderDetailController,
  filterOrderController,
  confirmOrderDeliveryController,
  cancelOrderController,
  getBanksController,
} from '../controllers/order';

const router = express.Router();

router.post('/', createOrderController);
router.get('/:orderId', orderDetailController);
router.get('/', filterOrderController);
router.put('/:orderId/confirm-delivery', confirmOrderDeliveryController);
router.put('/:orderId/cancel', cancelOrderController);
router.get('/chapa/banks', getBanksController);

export default router;
