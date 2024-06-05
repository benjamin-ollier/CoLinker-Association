import express, { Request, Response, NextFunction } from 'express';
import Activity from '../entities/activities';

const router = express.Router();

router.get('/byAssociation/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;
    const activities = await Activity.find({ association: associationId }).populate('association');
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

router.post('/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;

    const newActivity = new Activity({
      ...req.body,
      association: associationId
    });

    await newActivity.save();
    res.status(201).json({ message: 'Activité créée avec succès', activity: newActivity });
  } catch (error) {
    next(error);
  }
});


router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id).populate('association');
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    res.json(activity);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByIdAndUpdate(id, req.body, { new: true });
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    res.json({ message: 'Activité mise à jour avec succès', activity });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }
    res.json({ message: 'Activité supprimée avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
