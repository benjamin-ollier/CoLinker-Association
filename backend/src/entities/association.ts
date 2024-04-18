import mongoose, { Document, Schema, Types } from 'mongoose';

interface IMember {
  user: mongoose.Types.ObjectId;
  role: string;
  isBlocked: boolean;
}

interface IAssociation extends Document {
  name: string;
  siret: string;
  description: string;
  information?: string;
  member: IMember[];
}

const MemberSchema = new Schema<IMember>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: {
    type: String,
    required: true,
    enum: [
      'Président', 'Créateur', 'Vice-Président', 'Secrétaire', 'Trésorier', 
      'Membre du Conseil d\'Administration', 'Responsable des Communications', 
      'Bénévole', 'Membre Actif', 'Membre Bienfaiteur', 'Responsable des Événements', 
      'Coordinateur des Bénévoles', 'Responsable des Partenariats'
    ]
  },
  isBlocked: { type: Boolean, default: false }
});

const AssociationSchema = new Schema<IAssociation>({
  name: { type: String, required: true },
  siret: { type: String, required: true },
  description: { type: String, required: true },
  information: { type: String, optional: true },
  member: [MemberSchema]
});

const Association = mongoose.model<IAssociation>('Association', AssociationSchema);

export default Association;
