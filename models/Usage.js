import mongoose from "mongoose";

const UsageSchema = new mongoose.Schema({
  shopDomain: { type: String, required: true },
  orderId: { type: String, required: true, unique: true }, // UNIQUE constraint
  treesPlanted: Number,
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

// Add compound index
UsageSchema.index({ shopDomain: 1, orderId: 1 }, { unique: true });