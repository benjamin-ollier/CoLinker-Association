import express, { Request, Response, NextFunction } from 'express';
import AssembleeGenerale from '../entities/assembleeGenerale';
import IAssembleeGenerale from '../entities/assembleeGenerale';
import Association from '../entities/association';
import { verifyToken } from '../middlewares/authenticate';
import Vote, {IOption, IVote} from '../entities/vote';

const router = express.Router();

router.post('/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;
    const { title, description, type, dateStart, dateEnd, status, detailAgenda, location, votes, document } = req.body;

    const association = await Association.findById(associationId);
    if (!association) return res.status(404).send("Association non trouvée");

    const nouvelleAG = new AssembleeGenerale({
      associationId,
      title,
      description,
      type,
      dateStart,
      dateEnd,
      status,
      detailAgenda,
      location,
      member: association.member,
      votes,
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
    
    determineStatus(ag);

    res.json(ag);
  } catch (error) {
    next(error);
  }
});

router.get('/byAssociation/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;
    const assembleesGenerales = await AssembleeGenerale.find({ associationId: associationId });

    if (!assembleesGenerales.length) {
      return res.status(203).json({ message: 'Aucune assemblée générale trouvée pour cette association.' });
    }

    assembleesGenerales.forEach(ag => determineStatus(ag));

    res.json(assembleesGenerales);
  } catch (error) {
    next(error);
  }
});

router.get('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id

    const associations = await Association.find({ "member.user": userId })
      .populate('member.user', 'username isBlocked');

    if (associations.length === 0) {
      return res.status(204).json({ message: "Aucune association trouvée pour cet utilisateur." });
    }

    const validAssociations = associations.filter(association => {
      return association.member.some(member => member.user._id.equals(userId) && !member.isBlocked);
    });

    if (validAssociations.length === 0) {
      return res.status(204).json({ message: "Aucune association valide trouvée pour cet utilisateur." });
    }

    const validAssociationIds = validAssociations.map(association => association._id);

    const assembleesGenerales = await AssembleeGenerale.find({ associationId: { $in: validAssociationIds } });

    assembleesGenerales.forEach(ag => determineStatus(ag));

    res.json(assembleesGenerales);
  } catch (error) {
    next(error);
  }
});


router.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, type, dateStart, dateEnd, status, detailAgenda, location, member, votes, document } = req.body;

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
    agToUpdate.votes = votes;
    agToUpdate.document = document;

    await agToUpdate.save();

    res.json({ message: 'Assemblée générale mise à jour avec succès', assembleeGenerale: agToUpdate });
  } catch (error) {
    next(error);
  }
});

function determineStatus(ag: any): void {
  const now = new Date();
  let statusChanged = false;

  if (ag.status !== 'terminé' && ag.status != null) {
    if (ag.dateStart > now) {
      ag.status = 'annoncé';
      statusChanged = true;
    } else if (ag.dateStart <= now && ag.dateEnd >= now) {
      ag.status = 'en cours';
      statusChanged = true;
    } else if (ag.dateEnd < now) {
      ag.status = 'terminé';
      statusChanged = true;
    }
  } else if (ag.status == null) {
    if (ag.dateStart > now) {
      ag.status = 'annoncé';
      statusChanged = true;
    } else if (ag.dateStart <= now && ag.dateEnd >= now) {
      ag.status = 'en cours';
      statusChanged = true;
    } else {
      ag.status = 'terminé';
      statusChanged = true;
    }
  }

  if (statusChanged) {
    ag.markModified('status');
  }
}

router.delete('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { id } = req.params;

    // Supprimer les votes associés à l'Assemblée Générale
    await Vote.deleteMany({ ag: id });

    // Supprimer l'Assemblée Générale
    const ag = await AssembleeGenerale.findByIdAndDelete(id);
    if (!ag) {
      return res.status(404).json({ message: 'Assemblée générale non trouvée' });
    }

    res.json({ message: 'Assemblée générale et tous les votes associés supprimés avec succès' });
  } catch (error) {
    next(error);
  }
});


export default router;
