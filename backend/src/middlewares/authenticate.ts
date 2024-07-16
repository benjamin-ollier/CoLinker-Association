import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entities/user';
import { IUser } from '../entities/user';
import Association from '../entities/association';

interface ITokenPayload {
  userId: string;
}


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      const userPayload = decoded as ITokenPayload;
      try {
        const user = await User.findById(userPayload.userId);
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        (req as any).user = user;
        next();
      } catch (err) {
        res.status(401).json({ message: 'Server error' });
      }
    });
  } else {
    res.status(401).json({ message: 'Access token is missing' });
  }
};


const verifyUserBlock = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?._id;
  const associationId = req.params.associationId;

  if (!userId || !associationId) {
    return res.status(400).json({ message: 'Missing user or association information' });
  }

  try {
    const association = await Association.findById(associationId);
    if (!association) {
      return res.status(404).json({ message: "Association not found." });
    }

    const member = association.member.find(m => m.user.toString() === userId.toString());
    if (!member) {
      return res.status(404).json({ message: "User is not a member of this association." });
    }

    if (member.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked. Contact support for more information.' });
    }

    next();
  } catch (error) {
    console.error('Error checking if user is blocked:', error);
    res.status(500).json({ message: 'Server error during block check', error });
  }
};


export { verifyUserBlock };


export { verifyToken };
