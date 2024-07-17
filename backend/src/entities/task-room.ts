import mongoose, { Types } from 'mongoose';

export interface ITaskRoom extends mongoose.Document {
  _id: Types.ObjectId;
  associationId: Types.ObjectId;
  address: string;
  name: string;
  isAvailable: boolean;
}

const taskRoomSchema = new mongoose.Schema<ITaskRoom>(
  {
    associationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Association', // Référence au modèle Association
    },
    address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const TaskRoom = mongoose.model<ITaskRoom>('TaskRoom', taskRoomSchema);

export default TaskRoom;
