import express, { Request, Response, NextFunction } from 'express';
import Note from '../entities/note';
import User from '../entities/user';

const router = express.Router();

router.get('/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {username} = req.params
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const allNotes = await Note.find({ username : username});
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

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { username, content, title } = req.body;

    const noteToUpdate = await Note.findById(id);

    if (!noteToUpdate) {
      return res.status(404).json({ message: 'Note non trouvée.' });
    }

    noteToUpdate.username = username;
    noteToUpdate.content = content;
    noteToUpdate.title = title;

    await noteToUpdate.save();

    res.json({ message: 'Note mise à jour avec succès', note: noteToUpdate });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: "Note non trouvée" });
    }


    res.status(200).json({ message: 'Note supprimée avec succès' });
  } catch (error) {
      next(error);
  }
});

export default router;
