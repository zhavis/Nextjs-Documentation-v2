import mongoose, { Schema, Document, model } from "mongoose";

export interface IStatus extends Document {
  day: string;
  ping: number;
  status: string;
}

const StatusSchema = new Schema<IStatus>(
  {
    day: { type: String, required: true, unique: true },
    ping: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const Status = mongoose.models.Status || model<IStatus>("Status", StatusSchema);
