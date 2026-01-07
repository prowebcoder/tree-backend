import express from "express";
import Shop from "../models/Shop.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { shopDomain } = req.body;

  let shop = await Shop.findOne({ shopDomain });
  if (!shop) {
    shop = await Shop.create({ shopDomain });
  }

  res.json(shop);
});

export default router;
