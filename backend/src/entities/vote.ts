import mongoose, { Document } from 'mongoose';

interface IOption extends Document {
  texte: string;
  votants: mongoose.Types.ObjectId[];
}

interface IVote extends Document {
  associationId: mongoose.Types.ObjectId;
  titre: string;
  description: string;
  dateDebut: Date;
  dateFin: Date;
  question: string;
  typeDestinataire: 'Tous' | 'Administrateurs' | 'Membres spécifiques'; 
  options: IOption[];
}

const optionSchema = new mongoose.Schema<IOption>({
  texte: { type: String, required: true },
  votants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, { _id: true });

const voteSchema = new mongoose.Schema<IVote>({
  associationId:{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Association', required: true
  },
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateDebut: {
    type: Date,
    required: false
  },
  dateFin: {
    type: Date,
    required: false
  },
  question: {
    type: String,
    required: true
  },
  typeDestinataire: {
    type: String,
    enum: ['Tous', 'Administrateurs', 'Membres spécifiques'],
    required: true
  },
  options: [optionSchema]
}, { timestamps: true });

const Vote = mongoose.model<IVote>('Vote', voteSchema);

export default Vote;
