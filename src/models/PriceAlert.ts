import mongoose from "mongoose";

const PriceAlertSchema = new mongoose.Schema({
  chatId: { type: Number, required: true },
  tokenId: { type: String, required: true },
  direction: { type: String, enum: ["above", "below"], required: true },
  targetPrice: { type: Number, required: true },
});

export default mongoose.model("PriceAlert", PriceAlertSchema);
