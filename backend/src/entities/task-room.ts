import mongoose, { Types } from 'mongoose';

export interface ITaskRoom extends mongoose.Document {
  _id: Types.ObjectId;
  address: string;
  name: string;
  isAvailable: boolean;
}

const taskRoomSchema = new mongoose.Schema<ITaskRoom>(
  {
    address: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

const TaskRoom = mongoose.model<ITaskRoom>('TaskRoom', taskRoomSchema);

export default TaskRoom;
