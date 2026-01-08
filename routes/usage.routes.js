import express from "express";
import Usage from "../models/Usage.js";
import Store from "../models/Store.js";

const router = express.Router();

/**
 * Save usage (called when a paid order happens)
 */
router.post("/", async (req, res) => {
  const { shopDomain, orderId, treesPlanted } = req.body;

  const store = await Store.findOne({ shopDomain });
  if (!store) {
    return res.status(404).json({ error: "Store not found" });
  }

  const amount = treesPlanted * store.pricePerTree;

  const usage = await Usage.create({
    shopDomain,
    orderId,
    treesPlanted,
    amount
  });

  res.json(usage);
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
