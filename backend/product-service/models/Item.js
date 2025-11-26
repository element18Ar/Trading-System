import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    // NEW: Store uploaded image file path
    image: {
      type: String,
      required: true,
    },

    // NEW: quantity (optional)
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Required seller ID (ObjectId)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isListed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", ItemSchema);
