import express from "express";
import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import connectDB from "../config/db.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import fs from "fs";
import itemRoutes from "./routes/itemRoutes.js";
import { loadEnv } from "../config/loadEnv.js";

loadEnv(import.meta.url, dotenvFlow);

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

try { fs.mkdirSync("uploads", { recursive: true }); } catch {}
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/products/items", itemRoutes);

app.get("/", (req, res) => {
  res.send("Product Service is operational.");
});

app.post("/api/token/exchange", (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || 'dev_secret_key';
    const serviceSecret = process.env.JWT_SECRET || 'dev_secret_key';
    let decoded;
    try { decoded = jwt.verify(token, accessSecret); } catch {}
    if (!decoded) {
      try { decoded = jwt.verify(token, serviceSecret); } catch {}
    }
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    const serviceToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      serviceSecret || accessSecret,
      { expiresIn: "2h" }
    );
    return res.json({ token: serviceToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

const PORT = process.env.PORT || 5001;

connectDB(mongoose)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Product Service running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB for product-service:", err);
    process.exit(1);
  });
