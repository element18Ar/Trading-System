import express from 'express';
import { 
    createMessage, 
    getMessages 
} from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// 1. Save a message to the database
// Usually called strictly by the frontend or internally by the Socket handler
router.post('/', verifyToken, createMessage);

// 2. Fetch chat history for a specific trade room
// Usage: GET /api/messages/65f2a... (Trade ID)
router.get('/:tradeId', verifyToken, getMessages);

export default router;