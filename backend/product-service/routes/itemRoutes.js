// 1. Import Express and router using ES Module syntax
import express from 'express';

// 2. Import the *specific named exports* from the controller
import { listItem, getAllItems } from '../controllers/itemController.js'; 

const router = express.Router();

// Route for listing a new item
// This should be a protected route, requiring a logged-in seller
router
    .route('/')
    // Now listItem and getAllItems are properly imported and available
    .post(listItem) 
    
    // Route for browsing all items
    .get(getAllItems); 

// 3. Export the router using ES Module syntax
export default router;