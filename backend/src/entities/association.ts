import mongoose, { Document, Schema, Types } from 'mongoose';

interface IMember {
  user: mongoose.Types.ObjectId;
  role: string;
  isBlocked: boolean;
}

interface IWidget {
  title: string;
}

interface IAssociation extends Document {
  name: string;
  siret: string;
  informationDescription: string;
  informationTitle?: string;
  member: IMember[];
  image: string;
  widgetTitle: string;
  widgets: IWidget[];
  paypal_CLIENT_ID:string;
  paypal_CLIENT_SECRET:string;
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
      'Coordinateur des Bénévoles', 'Responsable des Partenariats','Donateur'
    ]
  },
  isBlocked: { type: Boolean, default: false }
});

const WidgetSchema = new Schema<IWidget>({
  title: { type: String, required: true },
});

const AssociationSchema = new Schema<IAssociation>({
  name: { type: String, required: true },
  siret: { type: String, required: true },
  widgetTitle: { type: String, required: false },
  informationDescription: { type: String, required: false },
  informationTitle: { type: String, optional: true, required:false },
  member: [MemberSchema],
  image: { type: String },
  widgets: [WidgetSchema] ,
  paypal_CLIENT_ID: { type: String },
  paypal_CLIENT_SECRET: { type: String },
});

const Association = mongoose.model<IAssociation>('Association', AssociationSchema);

export default Association;
