import express from "express";
import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "../config/db.js"; 
import { loadEnv } from "../config/loadEnv.js";

import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';

// Load environment variables
loadEnv(import.meta.url, dotenvFlow);

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  optionsSuccessStatus: 200,
}));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Auth Server and MongoDB are working!");
});

// Connect to MongoDB first
connectDB(mongoose)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });