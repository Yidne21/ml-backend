import express from 'express';
import userRoutes from '../routes/user';
import pharmacyRoutes from '../routes/pharmacy';
import drugRoutes from '../routes/drug';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/pharmacy', pharmacyRoutes);
router.use('/drug', drugRoutes);

export default router;
