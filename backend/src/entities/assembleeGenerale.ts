import mongoose, { Document } from 'mongoose';
import { IVote, voteSchema } from './vote';

interface IOption extends Document {
  texte: string;
  votants: mongoose.Types.ObjectId[];
}

interface IDocument extends Document {
  titre: string;
  url: string;
}

interface IAssembleeGenerale extends Document {
  associationId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'Ordinary' | 'Extraordinary';
  dateStart: Date;
  dateEnd: Date;
  status: string; 
  detailAgenda: string[];
  location: string;
  member: mongoose.Types.ObjectId[];
  votes: IVote[];
  document: IDocument[];
}

const optionSchema = new mongoose.Schema<IOption>({
  texte: { type: String, required: true },
  votants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { _id: true });

const assembleeGeneraleSchema = new mongoose.Schema<IAssembleeGenerale>({
  associationId:{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Association' 
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Ordinaire', 'Extraordinaire'],
    required: true
  },
  dateStart: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['annoncé', 'en cours', 'approuvé', 'terminé'],
    required: false
  },
  detailAgenda: [{
    type: String
  }],
  location: {
    type: String,
    required: true
  },
  member: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  votes: [{
    type: voteSchema,
    required: false
  }],
  document: [{
    titre: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    }
  }]
}, { timestamps: true });

const AssembleeGenerale = mongoose.model<IAssembleeGenerale>('AssembleeGenerale', assembleeGeneraleSchema);

export default AssembleeGenerale;
