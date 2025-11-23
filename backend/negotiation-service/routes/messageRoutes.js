import express from 'express';
import { 
    createMessage, 
    getMessages 
} from '../controllers/messageController.js';

const router = express.Router();

// 1. Save a message to the database
router.post('/', createMessage);

// 2. Fetch chat history for a specific trade room
router.get('/:tradeId', getMessages);

export default router;
