import express from 'express';
import { 
    createTrade, 
    getTradeDetails, 
    updateTradeOffer, 
    updateTradeStatus,
    getUserTrades
} from '../controllers/tradeController.js';

const router = express.Router();

// 1. Create a new negotiation
router.post('/', createTrade);

// 2. Get user's inbox (their trades)
router.get('/inbox', getUserTrades);

// 3. Get trade details
router.get('/:tradeId', getTradeDetails);

// 4. Update the offer
router.put('/:tradeId/offer', updateTradeOffer);

// 5. Update trade status
router.patch('/:tradeId/status', updateTradeStatus);

export default router;
