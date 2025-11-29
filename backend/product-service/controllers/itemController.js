// controllers/itemController.js
import Item from "../models/Item.js";

/**
 * @desc List a new item
 * @route POST /api/v1/products/items
 * @access Private
 */
const listItem = async (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("Body received:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { name, description, seller, price } = req.body;

    const item = await Item.create({
      name,
      description,
      seller,
      price: price || 0,
      image: req.file.path,
      isListed: true,
    });

    res.status(201).json({
      success: true,
      item,
    });

  } catch (error) {
    console.error("List item failed:", error);
    res.status(500).json({ error: "Server error, cannot list item." });
  }
};

/**
 * @desc Get all listed items
 * @route GET /api/v1/products/items
 * @access Public
 */
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ isListed: true });

    res.status(200).json({
      status: "success",
      results: items.length,
      data: { items }
    });

  } catch (error) {
    console.error("Get items failed:", error);
    res.status(500).json({
      status: "error",
      message: "Could not fetch items."
    });
  }
};

// FIXED EXPORT (ESM default+named issue removed)
export { listItem, getAllItems };
