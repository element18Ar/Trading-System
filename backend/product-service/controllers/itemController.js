// Change: This line is correct for ES Modules.
import Item from '../models/Item.js'; 

/**
 * @desc    Lists a new item for sale
 * @route   POST /api/products/items
 * @access  Private (Requires a logged-in seller)
 */
// Change: Use 'export const' instead of 'exports.listItem ='
export const listItem = async (req, res) => {
    try {
        // 1. Determine the Seller ID to use:
        //    - Use req.user.id if the user is authenticated (real system).
        //    - Otherwise, use the 'seller' field sent in the request body (for testing).
        //    - NOTE: The original code was overwriting the body with the invalid 'default_seller_id'.
        
        const finalSellerId = req.user ? req.user.id : req.body.seller; 
        
        // 2. Create the new Item document using the Item Model
        const newItem = await Item.create({
            // Spread the item details from the request (name, price, description, etc.)
            ...req.body, 
            
            // Explicitly set the seller using the determined ID. 
            // This ensures we use the valid ID from the body for testing.
            seller: finalSellerId
        });

        // 3. Send a success response (Status 201: Created)
        res.status(201).json({
            status: 'success',
            data: {
                item: newItem
            }
        });

    } catch (error) {
        // Handle database or validation errors
        res.status(400).json({
            status: 'fail',
            // Display the full error message for easier debugging
            message: error.message
        });
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