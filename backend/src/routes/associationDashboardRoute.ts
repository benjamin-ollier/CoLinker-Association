import express from 'express';
import mongoose from 'mongoose';
import Association from '../entities/association';
import User from '../entities/user';
import {uploadImageToFirebase} from '../share/uploadImageToFirebase';

const router = express.Router();
const multer = require('multer');
const upload = multer();

router.put('/dashboard', upload.single('image'), async (req, res) => {
  const { id, informationDescription, informationTitle, widgets } = req.body;
  let imageUrl;

  try {
    if (req.body.image.file) {
      imageUrl = await uploadImageToFirebase(req.body.image.file.buffer, req.body.image.file.originalname);
    }

    let association = await Association.findByIdAndUpdate(id, {
      informationDescription,
      informationTitle,
      image: imageUrl || '',
      widgets
    }, { new: true, runValidators: true });

    if (!association) {
      return res.status(404).json({ message: 'Association not found' });
    }

    res.status(200).json({
      message: 'Association updated successfully',
      association
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating association'    
    });
  }
});

// export const postCinemaRoomRoute = (app: express.Express) => {
//   app.post("/room",upload.array('files'), async (req: Request, res: Response) => {
//       const validation = cinemaRoomValidation.validate(req.body)

//       if (validation.error) {
//           res.status(400).send(generateValidationErrorMessage(validation.error.details))
//           return
//       }
//       const { name, description, type, capacity, handicapAccess, inMaintenance } = req.body;
//       const cinemaRoomRepo = AppDataSource.getRepository(CinemaRoom)
//       try {
//           let imagesUrl:any = [];
//           if(Array.isArray(req.files) && req.files.length > 0){
//               imagesUrl = await Promise.all([...req.files].map(async (file) => {
//                   const imageUrl = await uploadImageToFirebase(file.buffer, file.originalname);
//                   return imageUrl;
//               }));
//           }

//           const cinemaRoom = cinemaRoomRepo.create({
//               name,
//               description,
//               type,
//               capacity,
//               handicapAccess,
//               inMaintenance,
//               imagesUrl
//           });
//           const cinemaRoomCreated = await cinemaRoomRepo.save( cinemaRoom)

          
//           res.status(201).send(cinemaRoomCreated)
//       } catch (error) {
//           res.status(500).send({ "error": error })
//       }
//   })
// }


export default router;
