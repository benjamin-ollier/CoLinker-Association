import express, { Request, Response, NextFunction } from "express";
import TaskRoom from "../entities/task-room";
import { ObjectId, Types } from "mongoose";
import Association from "../entities/association";

const router = express.Router();

router.get('/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const associationId = req.params.associationId;

    const existingAssociation = await Association.findById(associationId);
    if (!existingAssociation) {
      return res.status(404).json({ message: "L'association spécifiée n'existe pas." });
    }

    const availableRooms = await TaskRoom.find({ associationId: associationId, isAvailable: true });

    if (availableRooms.length === 0) {
      return res.json([]).status(200);
    }

    return res.json(availableRooms).status(200);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, name, isAvailable, associationId } = req.body as {
      address: string;
      name: string;
      isAvailable: boolean;
      associationId: ObjectId;
    };

    const existingAssociation = await Association.findById(associationId);
    if (!existingAssociation) {
      return res.status(404).json({ message: "L'association spécifiée n'existe pas." });
    }

    const existingRoom = await TaskRoom.findOne({ name, associationId });
    if (existingRoom) {
      return res.status(400).json({ message: "Cette salle existe déjà pour cette association." });
    }

    const newTaskRoom = new TaskRoom({
      address,
      name,
      isAvailable,
      associationId,
    });

    await newTaskRoom.save();

    res.status(201).json({ message: 'Salle créée avec succès', taskRoom: newTaskRoom });
  } catch (error) {
    next(error);
  }
});


  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de tâche invalide" });
      }
  
      const taskRoom = await TaskRoom.findByIdAndDelete(id);
      if (!taskRoom) {
        return res.status(404).json({ message: "Salle non trouvée" });
      }
  
      return res.status(200).json({ message: 'Salle supprimée avec succès' });
    } catch (error) {
      next(error);
    }
  });

  

  export default router