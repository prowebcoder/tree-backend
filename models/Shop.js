import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  shopDomain: { type: String, required: true, unique: true },
  plan: { type: String, default: "usage" },
  pricePerTree: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Shop", ShopSchema);
