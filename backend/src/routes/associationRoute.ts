import express from 'express';
import mongoose from 'mongoose';
import Association from '../entities/association';
import User from '../entities/user';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { username, name, siret, description } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const existingAssociation = await Association.findOne({ "member.user": user, "member.role": "Créateur" });
  
    if (existingAssociation) {
      throw new Error("Cet utilisateur a déjà créé une association.");
    }

    const nouvelleAssociation = new Association({
      name,
      siret,
      description,
      member: [{
        user: user._id,
        role: 'Créateur'
      }]
    });

    await nouvelleAssociation.save();

    res.status(201).json({ message: 'Association créée avec succès', association: nouvelleAssociation });
  } catch (error) {
    next(error);
  }
});

router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const association = await Association.findOne({ "member.user": user._id }).populate('member.user', 'username');

    if (!association) {
      return res.status(404).json({ message: "Aucune association trouvée pour cet utilisateur." });
    }

    res.json(association);
  } catch (error) {
    next(error);
  }
});

router.get('/userAssociation/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    const associations = await Association.find({ "member.user": user._id }).populate('member.user', 'username');
    
    if (!associations.length) {
      return res.status(404).json({ message: "Aucune association trouvée pour cet utilisateur." });
    }
    
    res.json(associations);
  } catch (error) {
    next(error);
  }
});


export default router;
