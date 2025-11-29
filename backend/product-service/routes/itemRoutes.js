// itemRoutes.js
import express from 'express';
import multer from 'multer';
import { listItem, getAllItems } from '../controllers/itemController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Save uploaded images into /uploads
const upload = multer({ dest: "uploads/" });

// IMPORTANT: field name must match frontend ("itemImage")
router.post("/", verifyToken, upload.single("itemImage"), listItem);
router.get("/", getAllItems);

export default router;