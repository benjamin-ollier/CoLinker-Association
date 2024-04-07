import express, { Request, Response, NextFunction } from 'express';
import AssembleeGenerale from '../entities/assembleeGenerale';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titre, description, type, dateDebut, dateFin, status, ordreDuJour, lieu, membres, votes, documents } = req.body;

    const nouvelleAG = new AssembleeGenerale({
      titre,
      description,
      type,
      dateDebut,
      dateFin,
      status,
      ordreDuJour,
      lieu,
      membres,
      votes,
      documents
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

export default router;
