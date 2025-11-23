import express from "express";
import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import connectDB from "../config/db.js"; 

import { loadEnv } from "../config/loadEnv.js";
loadEnv(import.meta.url, dotenvFlow);

// ---------------------------------------------------------
// FIX: Use './' instead of '../' for local folders for local routes
// ---------------------------------------------------------
import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
// (Note: No import for trade/message routes here)
// ---------------------------------------------------------

const app = express();
app.use(express.json()); 

// routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
// (Note: No mounting for /api/trading here)

// Example route
app.get("/", (req, res) => {
  res.send("Auth Server and MongoDB are working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB(mongoose);
  console.log(`Server running on http://localhost:${PORT}`)
});