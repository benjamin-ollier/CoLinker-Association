import mongoose, { Document, Schema, Types } from 'mongoose';

interface IMember {
  user: mongoose.Types.ObjectId;
  role: string;
  isBlocked: boolean;
}

interface IWidget {
  title: string;
  location: string
  image: string
}

interface IAssociation extends Document {
  name: string;
  siret: string;
  informationDescription: string;
  informationTitle?: string;
  member: IMember[];
  image: string;
  widgetTitle?: string;
  widgets: IWidget[];
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

const WidgetSchema = new Schema<IWidget>({
  title: { type: String, required: true },
  location: { type: String, required: true},
  image: { type: String, required: true}
});

const AssociationSchema = new Schema<IAssociation>({
  name: { type: String, required: true },
  siret: { type: String, required: true },
  informationDescription: { type: String, required: false },
  informationTitle: { type: String, optional: true, required:false },
  member: [MemberSchema],
  image: { type: String },
  widgets: [WidgetSchema] ,
});

const Association = mongoose.model<IAssociation>('Association', AssociationSchema);

export default Association;
