import mongoose, { Types } from 'mongoose';

export interface ITaskRoom extends mongoose.Document {
  _id: Types.ObjectId;
  taskId: Types.ObjectId;
  address: string;
  name: string;
  isAvailable: boolean;
}

const taskRoomSchema = new mongoose.Schema<ITaskRoom>(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
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
