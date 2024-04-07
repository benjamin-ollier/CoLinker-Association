import 'express';
import type { IUser } from '../entities/user';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}