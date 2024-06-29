import express, { Request, Response, NextFunction } from 'express';
import User from '../entities/user';
import Donation from '../entities/donation';
import Association from '../entities/association';

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

router.get('/notifications/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({username});
    if (!user) return res.status(404).json({message: "Aucun membre n'est assigné à cet utilisateur."});

    const notifications = [];
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const donations = await Donation.find({ donor: user._id, type: "cotisation"});
    
    for (const donation of donations) {
      if (donation.date < oneMonthAgo) {
        const association = await Association.findById(donation.association);
        const timeWithoutDonation = now.getMonth() - donation.date.getMonth();
        if (association) {
          notifications.push({
            message: `Votre dernier don envers ${association.name} date d'il y a ${timeWithoutDonation} mois.`
          });
        }
      }
    }
  
    if (notifications.length > 0) {
      return res.status(200).json({ notifications });
    } else {
      return res.status(200).json({ message: "Toutes les donations sont à jour." });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
