import express from "express";
import Store from "../models/Store.js";

const router = express.Router();

/**
 * Called on app install / app load
 * Creates or updates store info
 */
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    console.log("🏪 Processing shop request:", data.shopDomain);

    if (!data.shopDomain) {
      return res.status(400).json({ error: "shopDomain is required" });
    }

    const store = await Store.findOneAndUpdate(
      { shopDomain: data.shopDomain },
      data,
      { upsert: true, new: true }
    );

    console.log("✅ Shop processed successfully:", data.shopDomain);

    res.json(store);
  } catch (error) {
    console.error("❌ Shop route error:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      error: "Failed to process shop",
      message: error.message 
    });
  }
});

export default router;