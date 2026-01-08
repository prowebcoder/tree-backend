import express from "express";
import Usage from "../models/Usage.js";
import Store from "../models/Store.js";

const router = express.Router();

/**
 * Save usage (called when a paid order happens)
 */
// usage.routes.js - Update the POST endpoint
router.post("/", async (req, res) => {
  try {
    const { shopDomain, orderId, treesPlanted, amount } = req.body;

    console.log("📝 Processing usage for order:", { shopDomain, orderId, treesPlanted, amount });

    // 1. Check if store exists
    const store = await Store.findOne({ shopDomain });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // 2. Check if this order already exists to prevent duplicates
    const existingUsage = await Usage.findOne({ 
      shopDomain, 
      orderId 
    });

    if (existingUsage) {
      console.log("⚠️ Order already processed, skipping duplicate:", orderId);
      return res.json({ 
        message: "Order already processed", 
        existingUsage 
      });
    }

    // 3. Calculate amount properly - use the amount from the request OR calculate
    const calculatedAmount = amount || (treesPlanted * store.pricePerTree);

    // 4. Create usage record
    const usage = await Usage.create({
      shopDomain,
      orderId,
      treesPlanted,
      amount: calculatedAmount,
      processedAt: new Date()
    });

    console.log("✅ Usage recorded:", {
      orderId,
      treesPlanted,
      amount: calculatedAmount
    });

    res.json({
      success: true,
      usage
    });

  } catch (error) {
    console.error("❌ Error processing usage:", error);
    res.status(500).json({ error: "Failed to process usage" });
  }
});

/**
 * Usage summary (billing)
 */
router.get("/:shopDomain", async (req, res) => {
  const data = await Usage.find({ shopDomain: req.params.shopDomain });

  const totalTrees = data.reduce((a, b) => a + b.treesPlanted, 0);
  const totalAmount = data.reduce((a, b) => a + b.amount, 0);

  res.json({
    totalOrders: data.length,
    totalTrees,
    totalAmount,
    data
  });
});

export default router;
