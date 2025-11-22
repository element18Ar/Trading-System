import mongoose from 'mongoose';

const TradeSchema = new mongoose.Schema({
  // 1. The Participants
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References your auth-service User
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The person receiving the trade offer
    required: true
  },

  // 2. The Assets (Double-sided trade)
  // Items the Initiator is offering to give
  initiatorItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item' // References your product-service Item
  }],
  // Items the Receiver is expected to give (The target item)
  receiverItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  
  // Optional: Cash top-up (e.g., "I'll trade my iPhone + $50")
  cashOffer: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'php' }
  },

  // 3. The State of the Deal
  status: {
    type: String,
    enum: ['proposed', 'negotiating', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'proposed'
  }
}, {
  timestamps: true
});

// Index allows quickly finding all trades for a specific user
TradeSchema.index({ initiator: 1, receiver: 1 });

const Trade = mongoose.model('trade', TradeSchema);
export default Trade;