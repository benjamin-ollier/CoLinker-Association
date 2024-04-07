import express, { Response, Request } from 'express';
import { authenticate } from '../middlewares/authenticate';
import User from '../entities/user';

const router = express.Router();

export default router;
