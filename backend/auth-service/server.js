import express from "express";
import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import connectDB from "../config/db.js"; // This likely stays ../ if config is shared

import { loadEnv } from "../config/loadEnv.js";
loadEnv(import.meta.url, dotenvFlow);

// ---------------------------------------------------------
// FIX: Use './' instead of '../' for local folders
// ---------------------------------------------------------
import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
// ---------------------------------------------------------

const app = express();
app.use(express.json()); 

//routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Server and MongoDB are working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB(mongoose);
  console.log(`Server running on http://localhost:${PORT}`)
});