import mongoose, { Types } from 'mongoose';


export interface INote extends mongoose.Document {
  _id: Types.ObjectId;
  username: string;
  content: string;
  title: string;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    username: {
      type: String,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

const note = mongoose.model<INote>('Note', noteSchema);

export default note;
