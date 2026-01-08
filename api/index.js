import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import shopRoutes from "../routes/shop.routes.js";
import usageRoutes from "../routes/usage.routes.js";
import orderRoutes from "../routes/order.routes.js";
import storeRoutes from "../routes/store.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/store", storeRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/order", orderRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected" 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🚨 Unhandled error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

export default app;