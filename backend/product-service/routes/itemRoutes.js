// 1. Import Express and router using ES Module syntax
import express from 'express';
import multer from 'multer';

// 2. Import the *specific named exports* from the controller
import { listItem, getAllItems } from '../controllers/itemController.js'; 

const router = express.Router();


const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("itemImage"), listItem);
router.get("/", getAllItems);

export default router;