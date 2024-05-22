import express, { Request, Response, NextFunction } from "express";
import TaskRoom from "../entities/task-room";
import { Types } from "mongoose";

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availableRooms = await TaskRoom.find({ isAvailable: true });
        if (availableRooms.length === 0) {
            return res.json({ message: "Il n'y a aucune salle disponible" }).sendStatus(200);
        }
        return res.json(availableRooms).sendStatus(200);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address, name, isAvailable } : { address: string, name: string, isAvailable: boolean } = req.body;
  
      const existingRoom = await TaskRoom.findOne({ name });
      if (existingRoom) {
        return res.status(400).json({ message: "Cette salle existe déjà." });
      }
  
      const newTaskRoom = new TaskRoom({
        address,
        name,
        isAvailable
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
        return res.status(400).json({ message: "ID invalide" });
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