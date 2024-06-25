import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../entities/user';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email,lastName,firstName, password: hashedPassword });
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Identifiants incorrects.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY || 'defaultSecretKey', {
      expiresIn: '1 hour'
    });

    user.token = token;
    await user.save();

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:username', async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
