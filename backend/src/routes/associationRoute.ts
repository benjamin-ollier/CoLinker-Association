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

    //const existingAssociation = await Association.findOne({ "member.user": user, "member.role": "Créateur" });
  
    /*if (existingAssociation) {
      throw new Error("Cet utilisateur a déjà créé une association.");
    }*/

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

router.get('/getUserAssociation/:username', async (req, res, next) => {
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

router.get('/userAssociation/username/:username', async (req, res, next) => {
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

router.delete('/removeMember/:associationId/:username', async (req, res) => {
  const { associationId, username } = req.params;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const association = await Association.findByIdAndUpdate(
      associationId,
      { $pull: { member: { user: user._id } } },
      { new: true }
    );

    if (!association) {
      return res.status(404).send('Association not found');
    }

    res.status(200).json({
      message: 'User removed successfully from association',
      association
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error removing user from association'
    });
  }
});


router.get('/membersNotInAssociation/:associationId', async (req, res) => {
  try {
    const { associationId } = req.params;

    const association = await Association.findById(associationId);
    if (!association) {
      return res.status(404).json({ message: "Association non trouvée." });
    }

    const memberIds = association.member.map(m => m.user);

    const nonMembers = await User.find({ _id: { $nin: memberIds } });

    res.json(nonMembers);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs non membres."});
  }
});


router.post('/addMember/:associationId', async (req, res, next) => {
  const { associationId } = req.params;
  const { userId, role } = req.body;

  try {
    // Rechercher l'utilisateur pour s'assurer qu'il existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Rechercher l'association pour s'assurer qu'elle existe
    const association = await Association.findById(associationId);
    if (!association) {
      return res.status(404).json({ message: "Association non trouvée." });
    }

    // Vérifier si l'utilisateur est déjà membre de l'association
    const isMember = association.member.some(member => member.user.toString() === userId);
    if (isMember) {
      return res.status(400).json({ message: "L'utilisateur est déjà membre de cette association." });
    }

    association.member.push({
      user: userId,
      role: role,
      isBlocked: false
    });

    await association.save();

    res.status(201).json({ 
      message: 'Utilisateur ajouté'});
  } catch (error) {
    next(error);
  }
});

router.get('/associationMembers/:associationId', async (req, res, next) => {
  try {
    const { associationId } = req.params;
    
    const association = await Association.findById(associationId);
    if (!association) {
      return res.status(404).json({ message: "Association non trouvée." });
    }
    
    const memberIds = association.member.map(m => m.user);
    
    const users = await User.find({ _id: { $in: memberIds } });
    
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/addUserToAssociation', async (req, res, next) => {
  try {
    const { associationId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const association = await Association.findById(associationId);
    if (!association) {
      return res.status(404).json({ message: "Association non trouvée." });
    }

    const isMember = association.member.some(member => member.user.toString() === user._id.toString());
    if (isMember) {
      return res.status(400).json({ message: "L'utilisateur est déjà membre de cette association." });
    }

    association.member.push({
      user: user._id,
      role: "Membre Actif",
      isBlocked: false
    });

    await association.save();

    res.status(201).json({ 
      message: 'Utilisateur ajouté à l\'association avec succès',
      association: association
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/editMember/:associationId/:userId', async (req, res) => {
  const { associationId, userId } = req.params;
  const { role, isBlocked } = req.body;

  try {
    const association = await Association.findById(associationId);
    if (!association) {
      return res.status(404).json({ message: "Association non trouvée." });
    }

    const memberIndex = association.member.findIndex(member => member.user.toString() === userId);
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Membre non trouvé dans l'association." });
    }

    if (role) association.member[memberIndex].role = role;
    if (isBlocked !== undefined) association.member[memberIndex].isBlocked = isBlocked;

    await association.save();

    res.status(200).json({
      message: 'Mise à jour du membre réussie',
      association: association
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du membre'    
    });
  }
});

router.get('/allAssociations', async (req, res, next) => {
  try {
    const associations = await Association.find({});
    res.json(associations);
  } catch (error) {
    next(error);
  }
});

router.get('/getAsoociationWithName/:name', async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({ message: "Le nom de l'association est requis pour la recherche." });
  }

  try {
    const regex = new RegExp(name, 'i');
    const associations = await Association.find({ name: regex });

    if (!associations.length) {
      return res.status(404).json({ message: "Aucune association trouvée avec ce nom." });
    }

    res.json(associations);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recherche des associations"});
  }
});



export default router;
