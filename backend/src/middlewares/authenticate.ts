import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entities/user';
import { IUser } from '../entities/user';

interface ITokenPayload {
  userId: string;
}


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey', async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token is not valid' });
      }
      const userPayload = decoded as ITokenPayload;
      try {
        const user = await User.findById(userPayload.userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        (req as any).user = user;
        next();
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    });
  } else {
    res.status(401).json({ message: 'Access token is missing' });
  }
};

export { verifyToken };
