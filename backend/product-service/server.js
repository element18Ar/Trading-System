import express from "express";
import cors from "cors"; 
import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import connectDB from "../config/db.js";
import dotenv from "dotenv-flow";
dotenv.config();


//Ako gi import ang product-service routes
import itemRoutes from "./routes/itemRoutes.js";// Note: Use the full path and .js extension


import { loadEnv } from "../config/loadEnv.js";
loadEnv(import.meta.url, dotenvFlow);

const app = express();
app.use(express.json()); // middleware to parse JSON

// --- ENABLE CORS ---
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,              // allow cookies/auth headers
}));

// --- Route Mounting ---
app.use("/api/v1/products/items", itemRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server and MongoDB are working!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  connectDB(mongoose);
  console.log(`Server running on http://localhost:${PORT}`);
});
