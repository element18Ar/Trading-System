import Trade from '../models/trade.js';
import Message from '../models/message.js';
import User from '../../auth-service/models/user.js';
import Item from '../../product-service/models/Item.js';

export const createTrade = async (req, res) => {
  try {
    const { initiatorId, receiverId, receiverItemId } = req.body;

    const existingTrade = await Trade.findOne({
      initiator: initiatorId,
      receiver: receiverId,
      receiverItems: receiverItemId,
      status: { $in: ['proposed', 'negotiating'] }
    });

    if (existingTrade) return res.status(200).json(existingTrade);

    const newTrade = new Trade({
      initiator: initiatorId,
      receiver: receiverId,
      receiverItems: [receiverItemId],
      initiatorItems: [],
      status: 'proposed',
      lastActivity: Date.now()
    });

    const savedTrade = await newTrade.save();
    res.status(201).json(savedTrade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTradeDetails = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.tradeId)
      .populate('initiator', 'username email')
      .populate('receiver', 'username email')
      .populate('initiatorItems')
      .populate('receiverItems');

    if (!trade) return res.status(404).json({ error: "Trade not found" });

    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTradeOffer = async (req, res) => {
  try {
    const { userId, items, cash } = req.body;
    const tradeId = req.params.tradeId;

    const trade = await Trade.findById(tradeId);
    if (!trade) return res.status(404).json({ error: "Trade not found" });

    if (userId === trade.initiator.toString()) trade.initiatorItems = items;
    else if (userId === trade.receiver.toString()) trade.receiverItems = items;
    else return res.status(403).json({ error: "You are not part of this trade" });

    if (cash) trade.cashOffer = cash;
    trade.status = 'negotiating';
    trade.lastActivity = Date.now();

    const updated = await trade.save();
    const populated = await updated.populate('initiatorItems receiverItems');
    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTradeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const trade = await Trade.findById(req.params.tradeId);
    if (!trade) return res.status(404).json({ error: "Trade not found" });

    trade.status = status;
    trade.lastActivity = Date.now();
    await trade.save();

    if (status === 'completed') {
      const allItems = [...trade.initiatorItems, ...trade.receiverItems];
      await Item.updateMany({ _id: { $in: allItems } }, { isListed: false, status: 'traded' });
    }

    res.status(200).json(trade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserTrades = async (req, res) => {
  try {
    const userId = req.params.userId;
    const trades = await Trade.find({ $or: [{ initiator: userId }, { receiver: userId }] })
      .sort({ lastActivity: -1 })
      .populate('initiator receiver', 'username avatar')
      .populate('initiatorItems receiverItems');

    res.status(200).json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Helper function to structure the trade and message data for the export file.
 * We assume populated fields (initiator, receiver, items) have 'username' and 'name' properties.
 */
const formatTradeForExport = (trade, messages) => {
    const { _id, initiator, receiver, status, cashOffer, createdAt, lastActivity } = trade;

    const initiatorName = initiator?.username || `User ID: ${initiator?._id}`;
    const receiverName = receiver?.username || `User ID: ${receiver?._id}`;
    
    // Convert arrays of item objects into a single, delimited string
    const initiatorItemNames = trade.initiatorItems.map(item => item?.name || item?._id).join('; ');
    const receiverItemNames = trade.receiverItems.map(item => item?.name || item?._id).join('; ');

    // Format the entire chat history into a single log string
    const chatTranscript = messages
        .map(msg => {
            const senderName = msg.sender?.username || 'System/Unknown';
            return `${msg.createdAt.toISOString()} | ${senderName}: ${msg.content}`;
        })
        .join('\n'); // Use newline to separate messages

    return {
        TradeID: _id.toString(),
        Status: status,
        Initiator: initiatorName,
        Receiver: receiverName,
        Initiator_Items: initiatorItemNames,
        Receiver_Items: receiverItemNames,
        Cash_Offer_Amount: cashOffer?.amount || 0,
        Cash_Offer_Currency: cashOffer?.currency?.toUpperCase() || 'PHP',
        Proposed_Date: createdAt.toISOString(),
        Last_Activity: lastActivity.toISOString(),
        Negotiation_Transcript: chatTranscript 
    };
};

/**
 * @desc    Fetches and prepares all completed trades and their chat logs for export.
 * @route   GET /api/negotiation/trades/export
 * @access  Private (Should be restricted to admin/privileged users)
 */
export const exportTransactions = async (req, res) => {
    try {
        // 1. Fetch completed trades. Populate fields needed for the export.
        const trades = await Trade.find({ status: 'completed' })
            .populate('initiator', 'username') 
            .populate('receiver', 'username') 
            .populate('initiatorItems', 'name') 
            .populate('receiverItems', 'name') 
            .sort({ createdAt: -1 })
            .lean(); 

        const exportedData = [];

        // 2. Loop through each trade to fetch its associated messages
        for (const trade of trades) {
            const messages = await Message.find({ tradeId: trade._id })
                .populate('sender', 'username') 
                .sort({ createdAt: 1 })
                .lean();

            // 3. Format the data
            const formattedTrade = formatTradeForExport(trade, messages);
            exportedData.push(formattedTrade);
        }
        
        // 4. Send the structured data back as JSON
        res.status(200).json(exportedData);

    } catch (error) {
        // Log the error for server-side debugging
        console.error('Error during transaction export:', error); 
        res.status(500).json({ message: 'Failed to export transactions', error: error.message });
    }
};
