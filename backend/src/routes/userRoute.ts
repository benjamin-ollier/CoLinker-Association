import express, { Request, Response, NextFunction } from 'express';
import User from '../entities/user';

const router = express.Router();

router.get('/getByUsername/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");;

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/deleteByUsername/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    await User.deleteOne({ username });
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
});

export default router;
