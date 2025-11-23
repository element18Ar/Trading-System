import Message from '../models/message.js';
import Trade from '../models/trade.js';
import User from '../../auth-service/models/user.js';  // Correct path

// ----------------------------------------------
// @desc    Post a new message (from frontend or socket)
// @route   POST /api/messages
// ----------------------------------------------
export const createMessage = async (req, res) => {
  try {
    const { tradeId, sender, content, type } = req.body;

    // Safety check: ensure trade exists
    const tradeExists = await Trade.findById(tradeId);
    if (!tradeExists) {
      return res.status(404).json({ error: "Trade room not found" });
    }

    const newMessage = new Message({
      tradeId,
      sender,
      content,
      type: type || 'text'
    });

    const savedMessage = await newMessage.save();

    // Update the trade last activity timestamp
    await Trade.findByIdAndUpdate(tradeId, {
      lastActivity: Date.now()
    });

    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};


// ----------------------------------------------
// @desc    Get chat history for a specific trade
// @route   GET /api/messages/:tradeId
// ----------------------------------------------
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      tradeId: req.params.tradeId
    })
      .sort({ createdAt: 1 })  // Oldest first
      .populate('sender', 'username avatar');  // Attach username + avatar

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};