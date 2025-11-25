import dotenv from "dotenv-flow";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import cors from "cors";

import connectDB from "../config/db.js";
import { loadEnv } from "../config/loadEnv.js";

import messageRoutes from "./routes/messageRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";


loadEnv(import.meta.url, dotenvFlow);

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Negotiation Service is operational."));

app.use("/api/messages", messageRoutes);
app.use("/api/trades", tradeRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  connectDB(mongoose);
  console.log(`Negotiation Service running at http://localhost:${PORT}`);
});
