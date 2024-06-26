import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Association from '../entities/association';
import User from '../entities/user';
import axios from 'axios';
import Donation from '../entities/donation';
import { verifyToken } from '../middlewares/authenticate';

const router = express.Router();

router.post('/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  const { amount, type } = req.body;

  if (!(req as any).user || !(req as any).user._id) {
    return res.status(401).json({ message: 'Unauthorized - No user found' });
  }

  try {
    const newDonation = new Donation({
      donor: (req as any).user._id,
      amount: amount,
      type: type
    });

    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (error) {
    console.error('Error saving donation:', error);
    res.status(500).json({ message: 'Error saving donation' });
  }
});

router.get('/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const donations = await Donation.aggregate([
      { $match: { type: type } },
      {
        $lookup: {
          from: "users",
          localField: "donor",
          foreignField: "_id",
          as: "donorDetails"
        }
      },
      { $unwind: "$donorDetails" },
      {
        $group: {
          _id: "$donorDetails._id",
          username: { $first: "$donorDetails.username" },
          email: { $first: "$donorDetails.email" },
          firstName: { $first: "$donorDetails.firstName" },
          lastName: { $first: "$donorDetails.lastName" },
          // Ajoutez d'autres champs nécessaires de l'utilisateur ici
          donations: {
            $push: {
              amount: "$amount",
              date: "$date",
              type: "$type"
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          // Assurez-vous d'inclure tous les champs de l'utilisateur que vous voulez renvoyer
          donations: 1
        }
      }
    ]);

    res.json(donations);
  } catch (error) {
    console.error('Failed to fetch donations by type:', error);
    res.status(500).json({ message: 'error message' });
  }
});


// router.get('/:id', async (req, res) => {
//   try {
//       const donation = await Donation.findById(req.params.id).populate('donor');
//       if (donation) {
//           res.json(donation);
//       } else {
//           res.status(404).json({ message: 'Donation not found' });
//       }
//   } catch (error) {
//     res.status(500).json({ message: 'error message' });
//   }
// });

router.put('/:id', async (req, res) => {
  const { amount, type } = req.body;
  try {
      const donation = await Donation.findById(req.params.id);
      if (donation) {
          donation.amount = amount || donation.amount;
          donation.type = type || donation.type;
          const updatedDonation = await donation.save();
          res.json(updatedDonation);
      } else {
          res.status(404).json({ message: 'Donation not found' });
      }
  } catch (error) {
    res.status(500).json({ message: 'error message' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
      const donation = await Donation.findByIdAndDelete(req.params.id);
      if (donation) {
          res.json({ message: 'Donation deleted successfully' });
      } else {
          res.status(404).json({ message: 'Donation not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'error message' });
  }
});

export default router;