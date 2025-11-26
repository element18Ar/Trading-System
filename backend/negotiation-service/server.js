import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import connectDB from "../config/db.js";
import { loadEnv } from "../config/loadEnv.js";

import messageRoutes from "./routes/messageRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";

loadEnv(import.meta.url);

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Negotiation Service is operational."));

app.use("/api/messages", messageRoutes);
app.use("/api/trades", tradeRoutes);

connectDB(mongoose)
  .then(() => {
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`Negotiation Service running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
