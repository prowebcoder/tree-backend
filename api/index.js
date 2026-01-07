import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import shopRoutes from "../routes/shop.routes.js";
import usageRoutes from "../routes/usage.routes.js";
import orderRoutes from "../routes/order.routes.js";
dotenv.config();

const app = express();
app.use(express.json());

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

app.get("/", (req, res) => {
  res.send("Tree Usage API is running");
});

app.use("/api/shop", shopRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/order", orderRoutes);

export default app;
