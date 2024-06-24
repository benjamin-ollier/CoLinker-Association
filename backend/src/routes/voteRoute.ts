import express, { Request, Response, NextFunction } from 'express';
import { RequestWithUser} from '../types/types';
import mongoose from 'mongoose';
import Vote, {IOption, IVote} from '../entities/vote';
import { Types } from 'mongoose';
import {IUser } from '../entities/user'
import { verifyToken } from '../middlewares/authenticate';

const router = express.Router();

router.get('/byAssociation/:associationId',  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;
    const votes = await Vote.find({ associationId: new mongoose.Types.ObjectId(associationId) }).populate('associationId');
    res.json(votes);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const votes = await Vote.find({});
    for (let vote of votes) {
      await processVoteResults(vote);
    }
    res.json(votes);
  } catch (error) {
    next(error);
  }
});


// POST create a new vote
router.post('/:associationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { associationId } = req.params;
    const newVote = new Vote({
      ...req.body,
      associationId: new mongoose.Types.ObjectId(associationId)
    });
    await newVote.save();
    res.status(201).json({ message: 'Vote créé avec succès', vote: newVote });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const vote = await Vote.findById(id);
    if (!vote) {
      return res.status(404).json({ message: 'Vote non trouvé' });
    }

    const updatedVote = await processVoteResults(vote);
    const updatUserVote= await checkUserVotedOptions(updatedVote, (req as any).user._id);
    res.json(updatUserVote);
  } catch (error) {
    console.error('Error processing vote:', error);
    next(error);
  }
});


// PUT update a vote
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

// DELETE a vote
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


router.post('/submitVote/:voteId', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const { voteId } = req.params;
  const { optionId } = req.body;
  const voterId = (req as any).user._id;
  
  try {
    const vote = await Vote.findById(voteId);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    const currentOptions = vote.currentStep === 1 ? 'optionStepOne' : 'optionStepTwo';

    if (hasUserVoted(vote, currentOptions, voterId.toString())) {
      res.status(409).json({ message: 'Voter has already voted on this option' });
    } else {
      const optionToUpdate = vote[currentOptions].find(option => option._id.equals(new mongoose.Types.ObjectId(optionId)));

      if (!optionToUpdate) {
        return res.status(404).json({ message: 'Option not found' });
      }

      optionToUpdate.votants.push(new mongoose.Types.ObjectId(voterId));
      await vote.save();
      res.status(200).json({ message: 'Vote successfully recorded', vote });
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    next(error);
  }
});

async function processVoteResults(vote: IVote): Promise<IVote> {
  const now = new Date();
  if (vote.endDate && now > vote.endDate && !vote.completed) {
    vote.completed = true;
    let optionsToProcess = vote.currentStep === 1 ? vote.optionStepOne : vote.optionStepTwo;

    // Calculate results directly
    const voteResults = optionsToProcess.map(option => option.votants.length);
    const totalVotes = voteResults.reduce((acc, current) => acc + current, 0);

    if (totalVotes >= vote.quorum) {
      const maxVotes = Math.max(...voteResults);
      optionsToProcess.forEach(option => {
        const isWinner = option.votants.length === maxVotes;
        if (vote.currentStep === 1) {
          option.set('winningOptionStepOne', isWinner);
        } else {
          option.set('winningOptionStepTwo', isWinner);
        }
      });

      // Prepare for the next step if necessary
      if (vote.doubleStep && vote.currentStep === 1 && optionsToProcess.some(option => option.winningOptionStepOne)) {
        vote.currentStep = 2;
        // Clear winning flags for the next step
        vote.optionStepTwo.forEach(option => {
          option.set('winningOptionStepTwo', false);
        });
      } else {
        vote.completed = true;
      }
    }

    await vote.save();
  }

  return vote;
}


function calculateResults(options: IOption[]): number[] {
  return options.map(option => option.votants.length);
}

function getTotalVotes(results: number[]): number {
  return results.reduce((acc, current) => acc + current, 0);
  
}


const checkUserVotedOptions = (vote: IVote, userId: Types.ObjectId): IVote => {
  const clonedVote = JSON.parse(JSON.stringify(vote));

  clonedVote.optionStepOne = clonedVote.optionStepOne.map((option: IOption) => ({
    ...option,
    checked: false
  }));
  clonedVote.optionStepTwo = clonedVote.optionStepTwo.map((option: IOption) => ({
    ...option,
    checked: false
  }));

  clonedVote.optionStepOne = clonedVote.optionStepOne.map((option: IOption) => ({
    ...option,
    checked: option.votants.map(id => id.toString()).includes(userId.toString()),
  }));

  clonedVote.optionStepTwo = clonedVote.optionStepTwo.map((option: IOption) => ({
    ...option,
    checked: option.votants.map(id => id.toString()).includes(userId.toString()),
  }));

  return clonedVote;
};

const hasUserVoted = (vote: IVote, options: string, userId: string): boolean => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const optionList = options === 'optionStepOne' ? vote.optionStepOne : vote.optionStepTwo;

  return optionList.some(option => option.votants.some(voterId => voterId.equals(userObjectId)));
};


export default router;
