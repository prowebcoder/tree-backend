import mongoose from "mongoose";

const UsageSchema = new mongoose.Schema({
  shopDomain: { type: String, required: true },
  orderId: { type: String, required: true },
  treesPlanted: Number,
  amount: Number,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Usage", UsageSchema);
