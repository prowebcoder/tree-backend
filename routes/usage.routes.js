import express from "express";
import Usage from "../models/Usage.js";
import Store from "../models/Store.js";

const router = express.Router();

/**
 * Save usage (called when a paid order happens)
 */
router.post("/", async (req, res) => {
  try {
    const { shopDomain, orderId, treesPlanted, amount } = req.body;

    console.log("📝 Processing usage request:", { shopDomain, orderId, treesPlanted, amount });

    // 1. Check if store exists
    const store = await Store.findOne({ shopDomain });
    if (!store) {
      console.log("❌ Store not found:", shopDomain);
      return res.status(404).json({ error: "Store not found" });
    }

    // 2. Check for duplicate - use shopDomain + orderId
    const existingUsage = await Usage.findOne({ 
      shopDomain: shopDomain, 
      orderId: orderId 
    });

    if (existingUsage) {
      console.log("⚠️ Duplicate order detected, skipping:", { shopDomain, orderId });
      return res.status(200).json({ 
        message: "Order already processed", 
        existingUsage 
      });
    }

    // 3. Use amount from request OR calculate with store's pricePerTree
    const calculatedAmount = amount || (treesPlanted * store.pricePerTree);

    // 4. Create usage record
    const usage = await Usage.create({
      shopDomain,
      orderId,
      treesPlanted,
      amount: calculatedAmount,
      createdAt: new Date()
    });

    console.log("✅ Usage recorded successfully:", { 
      orderId, 
      treesPlanted, 
      amount: calculatedAmount 
    });

    res.status(201).json({
      success: true,
      usage
    });

  } catch (error) {
    console.error("❌ Error in usage route:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      body: req.body
    });
    
    // Handle duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: "Duplicate entry",
        details: error.keyValue 
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
});

/**
 * Usage summary (billing)
 */
router.get("/:shopDomain", async (req, res) => {
  try {
    const data = await Usage.find({ shopDomain: req.params.shopDomain });

    const totalTrees = data.reduce((a, b) => a + b.treesPlanted, 0);
    const totalAmount = data.reduce((a, b) => a + b.amount, 0);

    res.json({
      totalOrders: data.length,
      totalTrees,
      totalAmount,
      data
    });
  } catch (error) {
    console.error("❌ Error getting usage summary:", error);
    res.status(500).json({ error: "Failed to get usage data" });
  }
});

export default router;