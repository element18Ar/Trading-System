import express from 'express';
import { 
  createTrade, getTradeDetails, updateTradeOffer, 
  updateTradeStatus, getUserTrades 
} from '../controllers/tradeController.js';

const router = express.Router();

router.post('/', createTrade);
router.get('/user/:userId', getUserTrades);
router.get('/:tradeId', getTradeDetails);
router.put('/:tradeId/offer', updateTradeOffer);
router.patch('/:tradeId/status', updateTradeStatus);

export default router;
