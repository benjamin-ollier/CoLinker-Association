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
  title: string;
  description: string;
  type: 'Ordinary' | 'Extraordinary';
  dateStart: Date;
  dateEnd: Date;
  status: string; 
  detailAgenda: string[];
  location: string;
  member: mongoose.Types.ObjectId[];
  vote: IVote[];
  document: IDocument[];
}

const assembleeGeneraleSchema = new mongoose.Schema<IAssembleeGenerale>({
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
  vote: [{
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
