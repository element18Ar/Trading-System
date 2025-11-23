import express from "express";
import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import connectDB from "../config/db.js";


import { loadEnv } from "../config/loadEnv.js";
loadEnv(import.meta.url, dotenvFlow);

const app = express();
app.use(express.json()); //middleware to parse JSON

// Example route
app.get("/", (req, res) => {
  res.send("Server and MongoDB are working!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  connectDB(mongoose);
  console.log(`Server running on http://localhost:${PORT}`)
});
