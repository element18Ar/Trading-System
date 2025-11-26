import express from 'express';
import { 
  createTrade, getTradeDetails, updateTradeOffer, 
  updateTradeStatus, getUserTrades, exportTransactions 
} from '../controllers/tradeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

router.post('/', createTrade);
router.get('/user/:userId', getUserTrades);
router.get('/:tradeId', getTradeDetails);
router.put('/:tradeId/offer', updateTradeOffer);
router.patch('/:tradeId/status', updateTradeStatus);
router.get('/export', exportTransactions);

export default router;
