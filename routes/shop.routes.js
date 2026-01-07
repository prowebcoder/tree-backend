import express from "express";
import Store from "../models/Store.js";

const router = express.Router();

/**
 * Called on app install / app load
 * Creates or updates store info
 */
router.post("/", async (req, res) => {
  const data = req.body;

  if (!data.shopDomain) {
    return res.status(400).json({ error: "shopDomain is required" });
  }

  const store = await Store.findOneAndUpdate(
    { shopDomain: data.shopDomain },
    data,
    { upsert: true, new: true }
  );

  res.json(store);
});

export default router;
