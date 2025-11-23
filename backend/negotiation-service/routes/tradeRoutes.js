import express from 'express';
import { 
    createTrade, 
    getTradeDetails, 
    updateTradeOffer, 
    updateTradeStatus,
    getUserTrades // *New Controller function needed for the Inbox
} from '../controllers/tradeController.js';
import { verifyToken } from '../middleware/auth.js'; // Assuming you have JWT auth

const router = express.Router();

// 1. Create a new negotiation (User A clicks "Trade" on User B's item)
router.post('/', verifyToken, createTrade);

// 2. Get the user's "Inbox" (List of all their active/past trades)
// Usage: GET /api/trades/inbox
router.get('/inbox', verifyToken, getUserTrades);

// 3. Get the specific "Trade Room" details (Items, Status, Participants)
router.get('/:tradeId', verifyToken, getTradeDetails);

// 4. Update the Offer (Add items, remove items, add cash)
// Note: This resets status to 'negotiating'
router.put('/:tradeId/offer', verifyToken, updateTradeOffer);

// 5. Finalize/Change Status (Accept, Reject, Cancel)
router.patch('/:tradeId/status', verifyToken, updateTradeStatus);

export default router;