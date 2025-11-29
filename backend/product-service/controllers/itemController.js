// Change: This line is correct for ES Modules.
import Item from '../models/Item.js'; 
import fs from 'fs';
import path from 'path';


export const listItem = async (req, res) => {
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
      image: req.file.path, // <--- save path from multer
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
 * @desc    Get a list of all available items (for browsing/catalog)
 * @route   GET /api/products/items
 * @access  Public
 */
// Change: Use 'export const' instead of 'exports.getAllItems ='
export const getAllItems = async (req, res) => {
    try {
        // 1. Fetch all items that are currently listed (isListed: true)
        // You would typically add filtering, sorting, and pagination here for a real system
        const items = await Item.find({ isListed: true });
        
        // 2. Send a success response (Status 200: OK)
        res.status(200).json({
            status: 'success',
            results: items.length,
            data: {
                items: items
            }
        });

    } catch (error) {
        // Handle errors
        res.status(500).json({
            status: 'error',
            message: 'Could not fetch items.'
        });
    }
};

export const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const isValid = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid item id format' });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const userId = String(req.user?.id || req.user?.sub || '');
    if (!userId || String(item.seller) !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.deleteOne({ _id: id });
    const img = item.image;
    if (img) {
      const filePath = path.isAbsolute(img) ? img : path.join(process.cwd(), 'backend', 'product-service', img.replace(/^\/?/, ''));
      fs.promises.unlink(filePath).catch(() => {});
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete item' });
  }
};
