import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();
app.use(express.json()); //middleware to parse JSON

// Connect to MongoDB once
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("Server and MongoDB are working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
