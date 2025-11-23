import express from "express";
import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import cors from "cors";

// Correct relative path from negotiation-service/server.js
import connectDB from "../config/db.js"; 
import { loadEnv } from "../config/loadEnv.js";

// Route imports (correct folder level)
import messageRoutes from "./routes/messageRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";

// Load environment variables
loadEnv(import.meta.url, dotenvFlow);

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("Negotiation Service is operational.");
});

// --- API Routes ---
app.use("/api/messages", messageRoutes);
app.use("/api/trades", tradeRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  connectDB(mongoose); // Connects to MongoDB
  console.log(
    `Negotiation Service running at http://localhost:${PORT} (${process.env.SERVICE_NAME})`
  );
});
