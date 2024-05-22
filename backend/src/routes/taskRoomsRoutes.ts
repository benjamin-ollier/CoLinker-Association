import express, { Request, Response, NextFunction } from "express";
import TaskRoom from "../entities/task-room";

const router = express.Router();


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

  export default router