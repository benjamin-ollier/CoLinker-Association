import mongoose, { Document, Schema, Types } from 'mongoose';

interface IDonation extends Document {
  donor: Types.ObjectId;
  amount: number;       
  date: Date;           
  type: string;
}

const DonationSchema = new Schema<IDonation>({
  donor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, required: true },
});

const Donation = mongoose.model<IDonation>('Donation', DonationSchema);

export default Donation;
