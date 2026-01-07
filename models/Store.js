import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  shopDomain: { type: String, required: true, unique: true },

  // Store identity
  name: String,
  email: String,
  country: String,
  currency: String,
  language: String,
  planName: String,

  // Billing config
  pricePerTree: { type: Number, default: 1 },
  billingStatus: { type: String, default: "active" },

  installedAt: { type: Date, default: Date.now },
  uninstalledAt: Date
});

export default mongoose.model("Store", StoreSchema);
