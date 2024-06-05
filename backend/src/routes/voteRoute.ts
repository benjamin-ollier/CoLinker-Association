import express, { Request, Response, NextFunction } from 'express';
import Vote from '../entities/vote';

const router = express.Router();

router.get('/byAssociation/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;
    const votes = await Vote.find({ associationId: associationId }).populate('associationId');
    res.json(votes);
  } catch (error) {
    next(error);
  }
});

router.post('/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;

    const newVote = new Vote({
      ...req.body,
      associationId: associationId
    });

    await newVote.save();
    res.status(201).json({ message: 'Vote créé avec succès', vote: newVote });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const vote = await Vote.findById(id);
    if (!vote) {
      return res.status(404).json({ message: 'Vote non trouvé' });
    }
    res.json(vote);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const vote = await Vote.findByIdAndUpdate(id, req.body, { new: true });
    if (!vote) {
      return res.status(404).json({ message: 'Vote non trouvé' });
    }
    res.json({ message: 'Vote mis à jour avec succès', vote });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const vote = await Vote.findByIdAndDelete(id);
    if (!vote) {
      return res.status(404).json({ message: 'Vote non trouvé' });
    }
    res.json({ message: 'Vote supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
