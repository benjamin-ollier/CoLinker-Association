import express, { Request, Response, NextFunction } from 'express';
import User from '../entities/user';
import Donation from '../entities/donation';
import Association from '../entities/association';
import Vote from '../entities/vote';
import mongoose from 'mongoose';

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

    const associations = await Association.find({member: {$elemMatch: {user: user._id}}});
    if (associations) {
      const associationIds = associations.map(asso => asso._id);
      const votes = await Vote.find({associationId: {$in: associationIds}}).exec();
      votes.some(vote => now >= vote.startDate && now <= vote.endDate && !vote.completed) && notifications.push({
        message: "Vous avez un ou plusieurs votes en cours."
      });
    }
  
    if (notifications.length > 0) {
      return res.status(200).json({ notifications });
    } else {
      return res.status(200).json({ message: "Aucune notification" });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/follow/:username/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, associationId } = req.params;
    
    const user = await User.findOne({username});
    if (!user) return res.status(404).json({message: 'Utilisateur non trouvé.'});
    const association = await Association.findById(associationId);
    if (!association) return res.status(404).send({message: 'Association non trouvée'});

    const associationObjId = new mongoose.Types.ObjectId(associationId);
    if (!user.follows.includes(associationObjId)) {
      user.follows.push(associationObjId);
    } else {
      user.follows = user.follows.filter(id => !id.equals(associationObjId));
    }
    await user.save();
    res.status(200).json({message: "Association suivie avec succès."});
  } catch (error) {
    next(error);
  }
});

router.get('/isfollow/:username/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, associationId } = req.params;
    
    const user = await User.findOne({username});
    if (!user) return res.status(404).json({message: 'Utilisateur non trouvé.'});
    const association = await Association.findById(associationId);
    if (!association) return res.status(404).send({message: 'Association non trouvée'});

    const associationObjId = new mongoose.Types.ObjectId(associationId);
    res.status(200).json({isFollow: user.follows.includes(associationObjId)});
  } catch (error) {
    next(error);
  }
});

export default router;
