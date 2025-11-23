import Trade from '../models/trade.js';
import Item from '../../product-service/models/Item.js';

// ----------------------------------------------
// @desc    Start a new negotiation
// @route   POST /api/trades
// ----------------------------------------------
export const createTrade = async (req, res) => {
  try {
    const { initiatorId, receiverId, receiverItemId } = req.body;

    // Prevent duplicate trade rooms
    const existingTrade = await Trade.findOne({
      initiator: initiatorId,
      receiver: receiverId,
      receiverItems: receiverItemId,
      status: { $in: ['proposed', 'negotiating'] }
    });

    if (existingTrade) {
      return res.status(200).json(existingTrade);
    }

    const newTrade = new Trade({
      initiator: initiatorId,
      receiver: receiverId,
      receiverItems: [receiverItemId],
      initiatorItems: [],
      status: 'proposed',
      lastActivity: Date.now()   // helps sorting inbox
    });

    const savedTrade = await newTrade.save();
    res.status(201).json(savedTrade);

  } catch (err) {
    res.status(500).json(err);
  }
};


// ----------------------------------------------
// @desc    Get specific trade details
// @route   GET /api/trades/:tradeId
// ----------------------------------------------
export const getTradeDetails = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.tradeId)
      .populate('initiator', 'username email')
      .populate('receiver', 'username email')
      .populate('initiatorItems')
      .populate('receiverItems');

    if (!trade) return res.status(404).json("Trade not found");

    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json(err);
  }
};


// ----------------------------------------------
// @desc    Update offer (add/remove items + cash)
// @route   PUT /api/trades/:tradeId/offer
// ----------------------------------------------
export const updateTradeOffer = async (req, res) => {
  try {
    const { userId, items, cash } = req.body;
    const tradeId = req.params.tradeId;

    const trade = await Trade.findById(tradeId);

    if (!trade) return res.status(404).json("Trade not found");

    // Determine which side is updating
    if (userId === trade.initiator.toString()) {
      trade.initiatorItems = items;
    } else if (userId === trade.receiver.toString()) {
      trade.receiverItems = items;
    } else {
      return res.status(403).json("You are not part of this trade");
    }

    if (cash) trade.cashOffer = cash;

    trade.status = 'negotiating';
    trade.lastActivity = Date.now();

    const updated = await trade.save();
    const populated = await updated.populate('initiatorItems receiverItems');

    res.status(200).json(populated);

  } catch (err) {
    res.status(500).json(err);
  }
};


// ----------------------------------------------
// @desc    Accept or finalize trade
// @route   PUT /api/trades/:tradeId/status
// ----------------------------------------------
export const updateTradeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const trade = await Trade.findById(req.params.tradeId);

    if (!trade) return res.status(404).json("Trade not found");

    trade.status = status;
    trade.lastActivity = Date.now();
    await trade.save();

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


// ----------------------------------------------
// @desc    Inbox — get all trades of a user
// @route   GET /api/trades/user/:userId
// ----------------------------------------------
export const getUserTrades = async (req, res) => {
  try {
    const userId = req.params.userId;

    const trades = await Trade.find({
      $or: [
        { initiator: userId },
        { receiver: userId }
      ]
    })
    .sort({ lastActivity: -1 })  // newest first
    .populate('initiator receiver', 'username avatar')
    .populate('initiatorItems receiverItems');

    res.status(200).json(trades);

  } catch (err) {
    res.status(500).json(err);
  }
};