import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  shopDomain: { type: String, required: true },
  orderId: { type: String, required: true }, // REMOVED unique: true
  
  orderNumber: String,
  orderStatus: String,
  paymentStatus: String,

  currency: String,
  totalOrderAmount: Number,

  // Contribution-specific
  treeProductId: String,
  pricePerUnit: Number,
  quantity: Number,
  totalContribution: Number,

  // Customer snapshot
  customer: {
    name: String,
    email: String,
    country: String
  },

  paidAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Remove automatic index creation temporarily
// OrderSchema.index({ shopDomain: 1, orderId: 1 }, { unique: true });

export default mongoose.model("Order", OrderSchema);