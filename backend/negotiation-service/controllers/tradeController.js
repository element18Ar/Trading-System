import Trade from '../models/trade.js';
import Item from '../models/Item.js'; // Needed to update item status later

// @desc    Start a new negotiation
// @route   POST /api/trades
export const createTrade = async (req, res) => {
  try {
    const { initiatorId, receiverId, receiverItemId } = req.body;

    // 1. Check if a trade already exists for this specific context to prevent duplicates
    const existingTrade = await Trade.findOne({
      initiator: initiatorId,
      receiver: receiverId,
      'receiverItems': receiverItemId,
      status: { $in: ['proposed', 'negotiating'] } 
    });

    if (existingTrade) {
      return res.status(200).json(existingTrade); // Return existing room
    }

    // 2. Create new Trade
    const newTrade = new Trade({
      initiator: initiatorId,
      receiver: receiverId,
      receiverItems: [receiverItemId], // Start with the item they wanted
      initiatorItems: [], // User adds their own items in the next step or UI
      status: 'proposed'
    });

    const savedTrade = await newTrade.save();
    res.status(201).json(savedTrade);

  } catch (err) {
    res.status(500).json(err);
  }
};

// @desc    Get specific trade details (The "Trade Desk" data)
// @route   GET /api/trades/:tradeId
export const getTradeDetails = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.tradeId)
      .populate('initiator', 'username email') // Get user details
      .populate('receiver', 'username email')
      .populate('initiatorItems') // Get actual Item objects (images, price)
      .populate('receiverItems');

    if (!trade) return res.status(404).json("Trade not found");
    
    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json(err);
  }
};

// @desc    Update the offer (Add/Remove items or Cash)
// @route   PUT /api/trades/:tradeId/offer
export const updateTradeOffer = async (req, res) => {
  try {
    const { userId, items, cash } = req.body; 
    const tradeId = req.params.tradeId;

    const trade = await Trade.findById(tradeId);
    
    // Determine if user is initiator or receiver to update correct array
    // Note: We convert ObjectIds to strings for comparison
    if (userId === trade.initiator.toString()) {
        trade.initiatorItems = items; // Replace with new array of Item IDs
    } else if (userId === trade.receiver.toString()) {
        trade.receiverItems = items;
    } else {
        return res.status(403).json("You are not part of this trade");
    }

    // Update Cash (Optional logic depending on who offered cash)
    if (cash) trade.cashOffer = cash;

    // CRITICAL: If an offer changes, any previous "Acceptance" is void.
    // Reset status to 'negotiating' so both parties must agree again.
    trade.status = 'negotiating';

    const updatedTrade = await trade.save();
    
    // Return populated data so UI updates immediately
    const populatedTrade = await updatedTrade.populate('initiatorItems receiverItems');
    
    res.status(200).json(populatedTrade);

  } catch (err) {
    res.status(500).json(err);
  }
};

// @desc    Accept or Finalize Trade
// @route   PUT /api/trades/:tradeId/status
export const updateTradeStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., 'accepted', 'completed', 'rejected'
    const trade = await Trade.findById(req.params.tradeId);

    trade.status = status;
    await trade.save();

    // If completed, we must mark the actual Items as 'traded' so they vanish from search
    if (status === 'completed') {
       const allItems = [...trade.initiatorItems, ...trade.receiverItems];
       await Item.updateMany(
         { _id: { $in: allItems } },
         { $set: { isListed: false, status: 'traded' } }
       );
    }

    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json(err);
  }
};