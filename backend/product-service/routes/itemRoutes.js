// 1. Import Express and router using ES Module syntax
import express from 'express';
import multer from 'multer';

// 2. Import the *specific named exports* from the controller
import { listItem, getAllItems, deleteItem } from '../controllers/itemController.js'; 
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


const upload = multer({ dest: "uploads/" });

router.post("/", verifyToken, upload.single("itemImage"), listItem);
router.get("/", getAllItems);
router.delete("/:id", verifyToken, deleteItem);

export default router;
