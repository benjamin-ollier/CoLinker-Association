import express, { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Note from '../entities/note';
import User from '../entities/user';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allNotes = await Note.find();
    if (allNotes.length == 0) return res.json({message: "Il n'y a aucune note"}).sendStatus(200);
    return res.json(allNotes).sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, content, title } = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const newNote = new Note({
      username,
      content,
      title
    });

    await newNote.save();

    res.status(201).json({ message: 'Note créée avec succès', note: newNote });
  } catch (error) {
    next(error);
  }
})



router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    return res.status(200).json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
