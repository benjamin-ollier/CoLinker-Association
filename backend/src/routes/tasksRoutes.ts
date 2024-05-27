import express, { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Task from '../entities/task';
import User from '../entities/user';
import TaskRoom from '../entities/task-room';

const router = express.Router();

router.get('/created/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {    
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const tasks = await Task.find({ username }).populate('taskRoom').sort({ isImportant : -1 });

    return res.status(200).json(tasks);

  } catch (error) {
    next(error);
  }
});


router.get('/assigned/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {    
    const { username } = req.params;
    const { isDone, start, end } = req.query;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    let query: any = { tagued_usernames: username, isDone: !!isDone };
    if (start && end) {
      const startDate = new Date(start.toString());
      const endDate = new Date(end.toString());
      endDate.setDate(endDate.getDate() + 1);
      query.dateDebut = { $gte: startDate };
      query.dateFin = { $lte: endDate };
    }

    let tasks = await Task.find(query).populate('taskRoom').sort({ isImportant: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});





router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, dateDebut, dateFin, title, tagued_usernames, taskRoomId, isImportant }: 
      { username: string, dateDebut: Date, dateFin: Date, title: string, tagued_usernames: string[], taskRoomId?: string , isImportant: boolean} = req.body;

      console.log(req.body);
      

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (tagued_usernames.includes(username)) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous attribuer la tâche à vous-même." });
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
        taskRoom.isAvailable = false;
      } catch (error) {
          return res.status(500).json({ message: "Erreur lors de la mise à jour de la salle." });
      }
    }

    const newTask = new Task({
      username,
      dateDebut,
      dateFin,
      title,
      taskRoom: taskRoom ? taskRoom._id : undefined,
      tagued_usernames,
      isImportant: isImportant
    });

    await newTask.save();
    if(taskRoom) await taskRoom.save();

    res.status(200).json({ message: 'Tâche créée avec succès', task: newTask, room: taskRoom });

  } catch (error) {
    next(error);
  }
});



router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isDone } = req.body        

    if (typeof isDone !== 'boolean') {
      return res.status(400).json({ message: "Le champ 'isDone' doit être un booléen." });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée." });
    }

    task.isDone = true;

    if (task.taskRoom) {
      const taskRoom = await TaskRoom.findById(task.taskRoom);
      if (taskRoom) {
        taskRoom.isAvailable = true;
        await taskRoom.save();
      }
    }

    await task.save();

    return res.status(200).json({ message: 'Tâche mise à jour avec succès', task });

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
