import express from "express";
import Store from "../models/Store.js";

const router = express.Router();

/**
 * UPSERT store info
 * POST /api/store/sync
 */
router.post("/sync", async (req, res) => {
  try {
    const {
      shopDomain,
      name,
      email,
      country,
      currency,
      planName
    } = req.body;

    console.log("🏪 Syncing store:", shopDomain);

    if (!shopDomain) {
      return res.status(400).json({ error: "shopDomain is required" });
    }

    const store = await Store.findOneAndUpdate(
      { shopDomain },
      {
        shopDomain,
        name,
        email,
        country,
        currency,
        planName,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log("✅ Store synced successfully:", shopDomain);

    res.json({
      success: true,
      store
    });
  } catch (error) {
    console.error("❌ Store sync error:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      error: "Failed to sync store",
      message: error.message 
    });
  }
});

export default router;