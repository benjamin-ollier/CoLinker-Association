import express, { Response, Request } from 'express';
import { authenticate } from '../middlewares/authenticate';

const router = express.Router();

router.get('/profile', authenticate, (req: Request, res: Response) => {
  if (req.body.username) {
    res.json({ message: `Welcome ${req.body.username}` });
  } else {
    res.status(403).json({ message: 'User not authenticated' });
  }
});

export default router;
