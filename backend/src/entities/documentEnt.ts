import mongoose, { Document } from 'mongoose';

interface IDocument extends Document {
  titre: string;
  description: string;
  url: string;
  ag: mongoose.Types.ObjectId;
}

const documentSchema = new mongoose.Schema<IDocument>({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  ag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssembleeGenerale',
    required: true
  }
}, { timestamps: true });

const documentEnt = mongoose.model<IDocument>('Document', documentSchema);

export default documentEnt;
