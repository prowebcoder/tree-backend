import mongoose from "mongoose";

const UsageSchema = new mongoose.Schema({
  shopDomain: { type: String, required: true },
  orderId: { type: String, required: true }, // REMOVED unique: true
  
  treesPlanted: Number,
  amount: Number,
  
  createdAt: { type: Date, default: Date.now }
});

// Remove automatic index creation temporarily
// UsageSchema.index({ shopDomain: 1, orderId: 1 }, { unique: true });

export default mongoose.model("Usage", UsageSchema);