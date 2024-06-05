import express from 'express';
import authRoutes from './authRoute';
import userRoutes from './userRoute';
import agRoutes from './assembleeGeneraleRoute';
import associationRoute from './associationRoute';
import associationDashboardRoute from './associationDashboardRoute';
import tasksRoutes from './tasksRoutes';
import notesRoutes from './notesRoutes';
import taskRoomsRoutes from './taskRoomsRoutes';
import pluginsRoutes from './pluginsRoutes';

import donationRoute from './donationRoute';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/ag', agRoutes);
router.use('/association', associationRoute);
router.use('/association', associationDashboardRoute);
router.use('/tasks', tasksRoutes);
router.use('/donation', donationRoute);
router.use('/taskRooms', taskRoomsRoutes);
router.use('/notes', notesRoutes);
router.use('/plugins', pluginsRoutes);


export default router;