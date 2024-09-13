import mongoose from "mongoose";

const DCAJobSchema = new mongoose.Schema({
  chatId: { type: Number, required: true },
  amount: { type: Number, required: true },
  cronExpression: { type: String, required: true },
  nextRun: { type: Date },
});

export default mongoose.model("DCAJob", DCAJobSchema);
