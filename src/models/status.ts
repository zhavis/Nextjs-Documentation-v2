import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  ping: { type: Number, required: true, default: -1 },
  status: { type: String, required: true, default: "down" },
});

const Status = mongoose.models.Status || mongoose.model("Status", statusSchema);

export default Status;
