import express, { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Task from '../entities/task';
import User from '../entities/user';
import TaskRoom from '../entities/task-room';

const router = express.Router();

router.get('/createdBy/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {    
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const tasks = await Task.find({ username }).populate('taskRoom');
    if (tasks.length === 0) {
      return res.status(200).json({ message: "Aucune tâche trouvée pour cet utilisateur" });
    }

    return res.status(200).json(tasks);

  } catch (error) {
    next(error);
  }
});


router.get('/attributed/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {    
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const tasks = await Task.find({ tagued_usernames: username }).populate('taskRoom');
    if (tasks.length === 0) {
      return res.status(200).json({ message: "Aucune tâche trouvée pour cet utilisateur" });
    }

    return res.status(200).json(tasks);

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

    let taskRoom;
    if (taskRoomId) {
      try {
        taskRoom = await TaskRoom.findById(taskRoomId);
        if (!taskRoom) {
          return res.status(404).json({ message: "Salle non trouvée." });
        }
        if (!taskRoom.isAvailable) {
          return res.status(400).json({ message: "La salle n'est pas disponible." });
        }
        taskRoom.isAvailable = false
        await taskRoom.save()

      } catch (error) {
        console.error("Erreur lors de la mise à jour de la salle :", error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour de la salle." });
      }
    }

    const newTask = new Task({
      username,
      dateDebut,
      dateFin,
      title,
      taskRoom: taskRoom ? taskRoom._id : undefined,
      tagued_usernames
    });

    await newTask.save();

    res.status(201).json({ message: 'Tâche créée avec succès', task: newTask, room: taskRoom });
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

    if (task.taskRoom) {
      const taskRoom = await TaskRoom.findById(task.taskRoom);
      if (taskRoom) {
        taskRoom.isAvailable = true;
        await taskRoom.save();
      }
    }

    return res.status(200).json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
