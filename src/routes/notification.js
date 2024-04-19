import express from 'express';
import {
  getNewNotificationController,
  getNotificationController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
  deleteAllNotificationController,
  createNewNotificationController,
} from '../controllers/notification';

import { authenticateJwt } from '../middlewares';

const router = express.Router();

router.get('/new', getNewNotificationController);
router.get('/', authenticateJwt, getNotificationController);
router.put('/:notificationId', authenticateJwt, markAsReadController);
router.put('/', authenticateJwt, markAllAsReadController);
router.delete(
  '/:notificationId',
  authenticateJwt,
  deleteNotificationController
);
router.delete('/', authenticateJwt, deleteAllNotificationController);
router.post('/', authenticateJwt, createNewNotificationController);

export default router;
