import express from "express";
import Order from "../models/Order.js";
import Usage from "../models/Usage.js";
import Store from "../models/Store.js";

const router = express.Router();

/**
 * Called when a PAID Shopify order contains tree product
 */
router.post("/", async (req, res) => {
  const data = req.body;

  // Prevent duplicates
  const exists = await Order.findOne({ orderId: data.orderId });
  if (exists) {
    return res.json({ message: "Order already recorded" });
  }

  const store = await Store.findOne({ shopDomain: data.shopDomain });
  if (!store) {
    return res.status(404).json({ error: "Store not found" });
  }

  const totalContribution = data.pricePerUnit * data.quantity;

  const order = await Order.create({
    ...data,
    totalContribution
  });

  await Usage.create({
    shopDomain: data.shopDomain,
    orderId: data.orderId,
    treesPlanted: data.quantity,
    amount: totalContribution
  });

  res.json({ success: true, order });
});

export default router;
