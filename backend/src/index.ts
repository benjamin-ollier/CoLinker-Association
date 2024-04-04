import express from 'express';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT: string | number = process.env.BackendPORT || 8000;

connectDB();

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
