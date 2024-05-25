import mongoose, { Types } from 'mongoose';


export interface ITask extends mongoose.Document {
  _id: Types.ObjectId;
  username: string;
  dateDebut: Date;
  dateFin: Date;
  title: string;
  taskRoom?: Types.ObjectId;
  tagued_usernames: string[];
  isDone: boolean;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    username: {
      type: String,
      ref: 'User',
      required: true
    },
    dateDebut: {
      type: Date,
      required: true,
      unique: true
    },
    dateFin: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    taskRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskRoom',
      required: false 
    },
    isDone: {
      type: Boolean,
      default: false,
      required: false
    },
    tagued_usernames: [{
      type: String,
      ref: 'User',
      required: true 
    }]
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
