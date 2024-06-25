import mongoose, { Document, Types } from 'mongoose';

export interface IOption extends Document {
  _id: Types.ObjectId;
  checked:boolean;
  texte: string;
  votants: Types.ObjectId[];
  winningOptionStepOne:boolean;
  winningOptionStepTwo:boolean;
}

export interface IVote extends Document {
  _id: Types.ObjectId;
  associationId: Types.ObjectId;
  ag: Types.ObjectId;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  question: string;
  optionStepOne: IOption[];
  optionStepTwo: IOption[];
  doubleStep: boolean;
  currentStep: number;
  quorum: number;
  completed: boolean;
}

const optionSchema = new mongoose.Schema<IOption>({
  texte: { type: String, required: true },
  votants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { _id: true });

const voteSchema = new mongoose.Schema<IVote>({
  associationId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Association', required: true
  },
  ag: {
    type: mongoose.Schema.Types.ObjectId, ref: 'AssembleeGenerale', required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  question: {
    type: String,
    required: true
  },
  optionStepOne: [optionSchema],
  optionStepTwo: [optionSchema],
  doubleStep: { type: Boolean, default: true },
  currentStep: { type: Number, default: 1 },
  quorum: { type: Number, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const Vote = mongoose.model<IVote>('Vote', voteSchema);

export default Vote;
