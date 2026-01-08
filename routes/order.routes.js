import express from "express";
import Order from "../models/Order.js";
import Usage from "../models/Usage.js";
import Store from "../models/Store.js";

const router = express.Router();

/**
 * Called when a PAID Shopify order contains tree product
 */
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    console.log("📦 Processing order request:", { 
      orderId: data.orderId, 
      shopDomain: data.shopDomain 
    });

    // Prevent duplicates - check by shopDomain + orderId
    const exists = await Order.findOne({ 
      shopDomain: data.shopDomain, 
      orderId: data.orderId 
    });
    
    if (exists) {
      console.log("⚠️ Order already exists:", data.orderId);
      return res.status(200).json({ 
        message: "Order already recorded", 
        existingOrder: exists 
      });
    }

    const store = await Store.findOne({ shopDomain: data.shopDomain });
    if (!store) {
      console.log("❌ Store not found:", data.shopDomain);
      return res.status(404).json({ error: "Store not found" });
    }

    const totalContribution = data.pricePerUnit * data.quantity;

    const order = await Order.create({
      ...data,
      totalContribution,
      createdAt: new Date()
    });

    // Also create usage record
    await Usage.create({
      shopDomain: data.shopDomain,
      orderId: data.orderId,
      treesPlanted: data.quantity,
      amount: totalContribution,
      createdAt: new Date()
    });

    console.log("✅ Order recorded successfully:", data.orderId);

    res.status(201).json({ 
      success: true, 
      order 
    });

  } catch (error) {
    console.error("❌ Error in order route:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      body: req.body
    });
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: "Duplicate order",
        details: error.keyValue 
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
});

export default router;