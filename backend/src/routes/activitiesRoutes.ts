import express, { Request, Response, NextFunction } from 'express';
import Activity from '../entities/activities';
import moment from 'moment-timezone';

const router = express.Router();

router.get('/byAssociation/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;
    const activities = await Activity.find({ association: associationId }).populate('association');

    await Promise.all(activities.map(async (activity) => {
      await autoUpdateActivityStatus(activity._id.toString());
    }));

    const updatedActivities = await Activity.find({ association: associationId }).populate('association');

    res.json(updatedActivities);
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

    await autoUpdateActivityStatus(activity._id.toString());
    const updatedActivities = await Activity.findById(id).populate('association');

    res.json(updatedActivities);
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

export async function autoUpdateActivityStatus(activityId:any) {
  try {
      const activity = await Activity.findById(activityId);
      if (!activity) {
          return { success: false, message: 'Activité non trouvée' };
      }

      const now = moment().tz('Europe/Paris').toDate();
      let newStatus = activity.status;

      if (now >= activity.dateStart && now <= activity.dateEnd) {
          newStatus = 'Ongoing';
      } else if (now > activity.dateEnd) {
          newStatus = 'Completed';
      } else if (now < activity.dateStart) {
          newStatus = 'Planned';
      }

      if (newStatus !== activity.status) {
          activity.status = newStatus;
          await activity.save();
      }

      return { success: true, message: 'Statut mis à jour automatiquement avec succès', activity };
  } catch (error) {
      console.error("Erreur lors de la mise à jour automatique du statut de l'activité:", error);
      return { success: false, message: 'Erreur lors de la mise à jour automatique du statut' };
  }
}

export default router;
