import express from 'express';
import userRoutes from '../routes/user';
import pharmacyRoutes from '../routes/pharmacy';
import drugRoutes from '../routes/drug';
import orderRoutes from '../routes/order';
import transactionRoutes from '../routes/transaction';
import feedbackRoutes from '../routes/feedback';
import reviewRoutes from '../routes/review';
import fileRoutes from '../routes/uploadFile';
import notificationRoutes from '../routes/notification';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/pharmacy', pharmacyRoutes);
router.use('/drug', drugRoutes);
router.use('/order', orderRoutes);
router.use('/transaction', transactionRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/review', reviewRoutes);
router.use('/file', fileRoutes);
router.use('/notification', notificationRoutes);

export default router;
