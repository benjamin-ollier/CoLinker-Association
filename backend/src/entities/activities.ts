import mongoose, { Document, Schema, Types } from 'mongoose';

interface IActivity extends Document {
  association: Types.ObjectId;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  dateStart: Date;
  dateEnd: Date;
  status: string;
  images: string[];
}

const ActivitySchema = new Schema<IActivity>({
  association: { type: Schema.Types.ObjectId, ref: 'Association', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { 
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Planned', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Planned'
  },
  images: [{ type: String }]
});

const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
