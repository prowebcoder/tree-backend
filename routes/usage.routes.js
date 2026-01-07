import express from "express";
import Usage from "../models/Usage.js";
import Shop from "../models/Shop.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { shopDomain, orderId, treesPlanted } = req.body;

  const shop = await Shop.findOne({ shopDomain });
  if (!shop) return res.status(404).json({ error: "Shop not found" });

  const amount = treesPlanted * shop.pricePerTree;

  const usage = await Usage.create({
    shopDomain,
    orderId,
    treesPlanted,
    amount
  });

  res.json(usage);
});

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
