import express from 'express';
import authRoutes from './authRoute';
import userRoutes from './userRoute';
import agRoutes from './assembleeGeneraleRoute';
import associationRoute from './associationRoute';
import associationDashboardRoute from './associationDashboardRoute';
import tasksRoutes from './tasksRoutes';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/ag', agRoutes);
router.use('/association', associationRoute);
router.use('/association', associationDashboardRoute);
router.use('/tasks', tasksRoutes);

export default router;