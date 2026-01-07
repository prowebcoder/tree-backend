import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import shopRoutes from "./routes/shop.routes.js";
import usageRoutes from "./routes/usage.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

const PORT = process.env.PORT || 4000;

app.use("/api/shop", shopRoutes);
app.use("/api/usage", usageRoutes);

app.listen(PORT, () =>
  console.log(`API running on port ${PORT}`)
);
