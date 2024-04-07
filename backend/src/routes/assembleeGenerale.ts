import express, { Request, Response, NextFunction } from 'express';
import AssembleeGenerale from '../entities/assembleeGenerale';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, type, dateStart, dateEnd, status, detailAgenda, location, member, vote, document } = req.body;

    const nouvelleAG = new AssembleeGenerale({
      title,
      description,
      type,
      dateStart,
      dateEnd,
      status,
      detailAgenda,
      location,
      member,
      vote,
      document
    });

    await nouvelleAG.save();

    res.status(201).json({ message: 'Assemblée générale créée avec succès', assembleeGenerale: nouvelleAG });
  } catch (error) {
    next(error);
  }
});

router.get('/getById/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ag = await AssembleeGenerale.findById(id);

    if (!ag) {
      return res.status(404).json({ message: 'Assemblée générale non trouvée.' });
    }

    res.json(ag);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assembleesGenerales = await AssembleeGenerale.find();

    res.json(assembleesGenerales);
  } catch (error) {
    next(error);
  }
});

router.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, type, dateStart, dateEnd, status, detailAgenda, location, member, vote, document } = req.body;

    const agToUpdate = await AssembleeGenerale.findById(id);

    if (!agToUpdate) {
      return res.status(404).json({ message: 'Assemblée générale non trouvée.' });
    }

    agToUpdate.title = title;
    agToUpdate.description = description;
    agToUpdate.type = type;
    agToUpdate.dateStart = dateStart;
    agToUpdate.dateEnd = dateEnd;
    agToUpdate.status = status;
    agToUpdate.detailAgenda = detailAgenda;
    agToUpdate.location = location;
    agToUpdate.member = member;
    agToUpdate.vote = vote;
    agToUpdate.document = document;

    await agToUpdate.save();

    res.json({ message: 'Assemblée générale mise à jour avec succès', assembleeGenerale: agToUpdate });
  } catch (error) {
    next(error);
  }
});


export default router;
