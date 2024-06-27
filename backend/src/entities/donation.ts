import mongoose, { Document, Schema, Types } from 'mongoose';

interface IDonation extends Document {
  donor: Types.ObjectId;
  association: Types.ObjectId;
  amount: number;       
  date: Date;           
  type: string;
}

const DonationSchema = new Schema<IDonation>({
  donor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  association: { type: Schema.Types.ObjectId, ref: 'Association', required: false },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, required: true },
},
{
  timestamps: true
});

const Donation = mongoose.model<IDonation>('Donation', DonationSchema);

export default Donation;
