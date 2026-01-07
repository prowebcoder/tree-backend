import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema({
  shopDomain: String,
  month: String, // YYYY-MM

  totalOrders: Number,
  totalTrees: Number,
  totalAmount: Number,

  status: { type: String, default: "pending" }, // pending, paid
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Billing", BillingSchema);
