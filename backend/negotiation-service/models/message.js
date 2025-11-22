import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  // Link to the specific Trade Room
  tradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade',
    required: true
  },
  
  // Who sent it?
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // The content
  content: {
    type: String,
    required: true,
    trim: true
  },

  // Is this a chat or a system alert? 
  // 'system' is for logs like: "User A added an item to the offer"
  type: {
    type: String,
    enum: ['text', 'system', 'image'],
    default: 'text'
  },

  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;