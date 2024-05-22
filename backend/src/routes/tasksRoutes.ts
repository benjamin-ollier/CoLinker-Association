import express, { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Task from '../entities/task';
import User from '../entities/user';
import TaskRoom from '../entities/task-room';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allTasks = await Task.find();
    if (allTasks.length == 0) return res.json({message: "Il n'y a aucune tâche"}).sendStatus(200);
    return res.json(allTasks).sendStatus(200);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, dateDebut, dateFin, title, tagued_usernames, taskRoomId }: 
      { username: string, dateDebut: Date, dateFin: Date, title: string, tagued_usernames: string[], taskRoomId?: string } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const taggedUsers = await User.find({ username: { $in: tagued_usernames } });
    const taggedUsernamesFound = taggedUsers.map(user => user.username);

    if (taggedUsernamesFound.length !== tagued_usernames.length) {
      const notFoundUsernames = tagued_usernames.filter(username => !taggedUsernamesFound.includes(username));
      return res.status(404).json({ message: "Un ou plusieurs utilisateurs attribués non trouvés.", notFoundUsernames });
    }

    if (taskRoomId) {
      const taskRoom = await TaskRoom.findById(taskRoomId);
      if (!taskRoom) {
        return res.status(404).json({ message: "Salle non trouvée." });
      }
      if (!taskRoom.isAvailable) {
        return res.status(400).json({ message: "La salle n'est pas disponible." });
      }
    }

    const newTask = new Task({
      username,
      dateDebut,
      dateFin,
      title,
      taskRoom: taskRoomId ?? undefined,
      tagued_usernames
    });

    await newTask.save();

    res.status(201).json({ message: 'Tâche créée avec succès', task: newTask });
  } catch (error) {
    next(error);
  }
});



router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    return res.status(200).json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
