import express from "express";
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
app.use(express.json()); //middleware to parse JSON

// --- Route Mounting ---
// 2. Mount the Item Routes under the desired API prefix
// I'll use /api/v1/products as a standard convention
app.use("/api/v1/products/items", itemRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Server and MongoDB are working!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  connectDB(mongoose);
  console.log(`Server running on http://localhost:${PORT}`)
});