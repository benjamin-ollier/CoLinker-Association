import express from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import agRoutes from './assembleeGenerale';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/ag', agRoutes);


export default router;