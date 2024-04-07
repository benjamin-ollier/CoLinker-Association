import mongoose, { Document } from 'mongoose';

interface IVote extends Document {
  membre: mongoose.Types.ObjectId;
  choix: string; //"Pour", "Contre", "Abstention"
}

interface IDocument extends Document {
  titre: string;
  url: string;
}

interface IAssembleeGenerale extends Document {
  titre: string;
  description: string;
  type: 'Ordinaire' | 'Extraordinaire';
  dateDebut: Date;
  dateFin: Date;
  status: string; 
  ordreDuJour: string[];
  lieu: string;
  membres: mongoose.Types.ObjectId[];
  votes: IVote[];
  documents: IDocument[];
}

const assembleeGeneraleSchema = new mongoose.Schema<IAssembleeGenerale>({
  titre: {
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
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  ordreDuJour: [{
    type: String
  }],
  lieu: {
    type: String,
    required: true
  },
  membres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  votes: [{
    membre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    choix: {
      type: String,
      enum: ['Pour', 'Contre', 'Abstention'],
      required: false
    }
  }],
  documents: [{
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
