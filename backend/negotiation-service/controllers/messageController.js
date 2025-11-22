import Message from '../models/message.js';
import Trade from '../models/trade.js';
import User from '../models/User.js';

// @desc    Post a new message (Called by frontend or Socket handler)
// @route   POST /api/messages
export const createMessage = async (req, res) => {
  try {
    const { tradeId, sender, content, type } = req.body;

    const newMessage = new Message({
      tradeId,
      sender,
      content,
      type: type || 'text'
    });

    const savedMessage = await newMessage.save();

    // Update the Trade's lastActivity timestamp (For sorting your Inbox)
    await Trade.findByIdAndUpdate(tradeId, { 
        lastActivity: Date.now() 
    });

    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

// @desc    Get chat history for a specific trade room
// @route   GET /api/messages/:tradeId
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ 
      tradeId: req.params.tradeId 
    })
    .sort({ createdAt: 1 }) // Oldest first (Chronological order)
    .populate('sender', 'username avatar'); // Need username for the chat bubble

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};